import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Configure your document processing preferences</p>
            </div>

            <Card className="shadow-card border-border/60 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-base">API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="endpoint">API Endpoint</Label>
                        <Input id="endpoint" value="https://api.docai.example.com/v1" readOnly className="rounded-xl bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="key">API Key</Label>
                        <Input id="key" type="password" value="sk-••••••••••••••••" readOnly className="rounded-xl bg-muted/50" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-card border-border/60 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-base">Processing Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Auto-retry failed pages</p>
                            <p className="text-xs text-muted-foreground">Automatically retry pages that fail processing</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Email notifications</p>
                            <p className="text-xs text-muted-foreground">Receive email when jobs complete or fail</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">High confidence mode</p>
                            <p className="text-xs text-muted-foreground">Only accept results with &gt;95% confidence</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <Button className="rounded-xl">Save Changes</Button>
        </div>
    );
};

export default SettingsPage;