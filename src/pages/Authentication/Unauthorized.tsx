import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6">
        <CardContent className="flex flex-col items-center text-center">
          <Alert variant="destructive">
            <AlertTitle>Unauthorized Access</AlertTitle>
            <AlertDescription>
              You do not have the necessary permissions to view this page.
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}