'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Users, ChevronRight } from "lucide-react";
import Link from "next/link";

export const SettingsContainer = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
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

            <Card className="shadow-card border-border/60 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-base">Management Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Link href="/users">
                        <div className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-accent/40 transition-colors cursor-pointer border border-transparent hover:border-border/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">User Management</p>
                                    <p className="text-xs text-muted-foreground">Manage user roles, system access, and accounts</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full pointer-events-none text-muted-foreground shrink-0">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </Link>
                </CardContent>
            </Card>

            <Button className="rounded-xl">Save Changes</Button>
        </div>
    );
};
