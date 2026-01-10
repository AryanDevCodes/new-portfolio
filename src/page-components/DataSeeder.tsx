import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle2, AlertCircle, Loader2, FileJson, Download, Trash2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SeedResult {
  success: boolean;
  message: string;
  details?: Record<string, string>;
}

export function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSeed = async () => {
    if (loading) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Data Imported Successfully",
          description: "All static data has been uploaded to Redis",
        });
      } else {
        toast({
          title: "Import Failed",
          description: data.message || "Failed to import data",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to seed data";
      setResult({
        success: false,
        message: errorMsg,
      });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (loading) return;
    
    setLoading(true);
    setResult(null);

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const response = await fetch("/api/admin/seed/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast({
          title: "File Uploaded Successfully",
          description: `Imported ${data.details ? Object.keys(data.details).length : 0} data sections`,
        });
      } else {
        toast({
          title: "Upload Failed",
          description: data.error || "Failed to upload file",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to parse or upload file";
      setResult({
        success: false,
        message: errorMsg,
      });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/admin/data/export");
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Data downloaded as JSON file",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to export data";
      setResult({
        success: false,
        message: errorMsg,
      });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (target: string) => {
    setDeleteTarget(target);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget || loading) return;
    
    setLoading(true);
    setResult(null);
    setShowDeleteDialog(false);

    try {
      const url = `/api/admin/data/delete?key=${deleteTarget}`;
      
      const response = await fetch(url, { method: "DELETE" });
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Deleted Successfully",
          description: `${deleteTarget} removed from Redis`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete Failed",
          description: data.error || "Failed to delete data",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to delete data";
      setResult({
        success: false,
        message: errorMsg,
      });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import from Static Files
          </CardTitle>
          <CardDescription>
            One-time import of existing data from <code className="text-xs">src/data/</code> files into Redis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>What this does:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
              <li>Reads portfolio-data.ts, skills.ts, and timeline.ts</li>
              <li>Transforms to admin panel format</li>
              <li>Uploads all 9 data sections to Redis (including timeline/story)</li>
            </ul>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                "skills", "certifications", "heroData", "socialLinks", "experience", "education", "mediumSettings", "featuredPosts", "timeline"
              ].map((key) => (
                <Button
                  key={key}
                  onClick={() => confirmDelete(key)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  {key}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleSeed}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import from Static Files
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            Upload JSON File
          </CardTitle>
          <CardDescription>
            Upload a JSON file containing portfolio data. Supports both admin format and custom schemas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select JSON File</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Upload a JSON file with keys: skills, certifications, heroData, socialLinks, experience, education
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-mono mb-2">Expected JSON structure:</p>
            <pre className="text-[10px] overflow-x-auto">
{`{
  "skills": [...],
  "certifications": [...],
  "heroData": {...},
  "socialLinks": [...],
  "experience": [...],
  "education": [...]
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Current Data
          </CardTitle>
          <CardDescription>
            Download all current admin data as JSON for backup or editing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to JSON
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Redis Data
          </CardTitle>
          <CardDescription>
            Remove specific data sections or clear all data from Redis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Delete Individual Data</Label>
            <div className="grid grid-cols-2 gap-2">
              {["skills", "certifications", "heroData", "socialLinks", "experience", "education", "mediumSettings", "featuredPosts"].map((key) => (
                <Button
                  key={key}
                  onClick={() => confirmDelete(key)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  {key}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            <p className="font-semibold">{result.message}</p>
            {result.details && (
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {Object.entries(result.details).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-mono">{key}:</span> {value}
                  </div>
                ))}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget}</strong> from Redis?
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
