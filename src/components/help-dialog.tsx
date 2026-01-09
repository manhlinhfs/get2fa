import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, AlertTriangle, HardDrive, DownloadCloud, ShieldAlert } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export function HelpDialog() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('common.help')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-border/50 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-primary">
            <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" /> {t('help_dialog.title')}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {t('help_dialog.subtitle')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {/* Storage Mechanism */}
            <div className="flex gap-3 sm:gap-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-500">
                    <HardDrive className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{t('help_dialog.storage_title')}</h3>
                    <p className="text-[13px] sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        <Trans i18nKey="help_dialog.storage_desc">
                            Your 2FA codes are stored <strong>directly on this browser</strong> (localStorage). 
                            We do <span className="text-red-500 font-medium">NOT</span> upload your data to any cloud server. 
                        </Trans>
                    </p>
                </div>
            </div>

            {/* Data Loss Risks */}
            <div className="flex gap-3 sm:gap-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 text-orange-500">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{t('help_dialog.risk_title')}</h3>
                    <p className="text-[13px] sm:text-sm text-muted-foreground mt-0.5">
                        {t('help_dialog.risk_desc')}
                    </p>
                    <ul className="list-disc list-inside text-[12px] sm:text-sm text-muted-foreground mt-1.5 space-y-0.5 ml-1">
                        <li><strong>{t('help_dialog.risk_1')}</strong></li>
                        <li>{t('help_dialog.risk_2')}</li>
                        <li>{t('help_dialog.risk_3')}</li>
                        <li>{t('help_dialog.risk_4')}</li>
                    </ul>
                </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 sm:gap-4 items-start">
                 <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                    <DownloadCloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div>
                    <h3 className="font-semibold text-primary text-sm sm:text-base">{t('help_dialog.rec_title')}</h3>
                    <p className="text-[12px] sm:text-sm text-muted-foreground mt-0.5">
                        <Trans i18nKey="help_dialog.rec_desc" components={{ icon: <SettingsIconInline/> }}>
                            Always use the <strong className="text-foreground">Settings <SettingsIconInline/> &gt; Export Backup</strong> feature immediately after adding new accounts.
                        </Trans>
                    </p>
                </div>
            </div>
        </div>

        <DialogFooter className="mt-2 sm:mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full h-12 sm:h-10 text-base font-bold rounded-2xl sm:rounded-xl shadow-sm active:scale-95 transition-transform">
              {t('common.cancel')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SettingsIconInline = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mx-1 mb-0.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
)
