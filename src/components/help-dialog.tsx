import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, AlertTriangle, HardDrive, DownloadCloud, ShieldAlert } from "lucide-react";

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-primary">
            <ShieldAlert className="h-6 w-6" /> Important Security Notice
          </DialogTitle>
          <DialogDescription>
            Understanding how your data is stored and how to protect it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            {/* Storage Mechanism */}
            <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-500">
                    <HardDrive className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Local Storage Only</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Your 2FA codes are stored <strong>directly on this browser</strong> (localStorage). 
                        We do <span className="text-red-500 font-medium">NOT</span> upload your data to any cloud server. 
                        This ensures maximum privacy but comes with risks.
                    </p>
                </div>
            </div>

            {/* Data Loss Risks */}
            <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 text-orange-500">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Risk of Data Loss</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        You will lose ALL your codes if you:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-1">
                        <li><strong>Clear browser cache/cookies</strong> or history.</li>
                        <li>Uninstall this browser or reinstall Windows/MacOS.</li>
                        <li>Use "Incognito/Private" mode (data vanishes on close).</li>
                        <li>Reset your device.</li>
                    </ul>
                </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                    <DownloadCloud className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="font-semibold text-primary">Our Recommendation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Always use the <strong className="text-foreground">Settings <SettingsIconInline/> &gt; Export Backup</strong> feature immediately after adding new accounts. Keep the backup file in a safe place (Cloud, USB).
                    </p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const SettingsIconInline = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mx-1 mb-0.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
)
