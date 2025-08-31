
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  const handleGoHome = () => {
    // Navigate to home page
    window.location.href = "/";
  };

  const handleGoBack = () => {
    // Go back to previous page
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-100 text-rose-600 mb-6">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h1 className="text-8xl font-bold text-slate-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-slate-500 mb-8">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="border-slate-200 hover:bg-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Need help?{" "}
              <a
                href="#"
                className="text-slate-900 hover:underline font-medium"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;