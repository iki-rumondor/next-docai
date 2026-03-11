import { SettingsContainer } from "@/features/settings";

const SettingsPage = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Configure your document processing preferences</p>
            </div>

            <SettingsContainer />
        </div>
    );
};

export default SettingsPage;
