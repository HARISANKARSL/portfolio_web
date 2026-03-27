import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // For demo: if you have a real API, use it here
      // const response = await authService.login({ email, password });
      
      // Demo: Create mock token and store in cookies
      const mockToken = `token_${Date.now()}`;
      const mockRefreshToken = `refresh_${Date.now()}`;
      
      authService.storeTokenData(mockToken, mockRefreshToken);
      
      // Redirect to admin dashboard after successful login
      navigate("/admin/skills");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
            <p className="text-xs text-gray-500 text-center mt-4">
              Demo: Use any email/password to login
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
