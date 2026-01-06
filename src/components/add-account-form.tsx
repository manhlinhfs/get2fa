import { useState } from "react";
import { Save, X, ClipboardPaste, KeyRound, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { TwoFactorAccount } from "@/hooks/use-2fa";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AddAccountFormProps {
  onAdd: (account: Omit<TwoFactorAccount, "id" | "token" | "period" | "remaining">) => void;
  availableTags: string[];
}

export function AddAccountForm({ onAdd, availableTags }: AddAccountFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [label, setLabel] = useState("");
  const [secret, setSecret] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handlePaste = async (setter: (val: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setter(text);
        toast.success("Pasted from clipboard");
      }
    } catch (err) {
      toast.error("Clipboard access denied");
    }
  };

  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
    }
  };

  const toggleTag = (tag: string) => {
      if (tags.includes(tag)) {
          setTags(tags.filter(t => t !== tag));
      } else {
          setTags([...tags, tag]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;

    onAdd({
      issuer: label || "Account",
      label: label || "2FA",
      secret: secret.replace(/[\s-]/g, "").toUpperCase(),
      tags,
    });

    setLabel("");
    setSecret("");
    setTags([]);
    setTagInput("");
    toast.success("Account added successfully");
  };

  return (
    <div className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20 group">
      
      <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
                {/* Account Name */}
                <div className="space-y-2 group/input">
                    <label htmlFor="label" className="text-xs font-semibold ml-1 text-foreground/70 group-focus-within/input:text-primary transition-colors flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Service Name
                    </label>
                    <div className="relative">
                        <Input
                        id="label"
                        placeholder="e.g. Facebook, Gmail, Github..."
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        onClick={() => !label && handlePaste(setLabel)}
                        className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all text-base pl-4 pr-10 rounded-xl"
                        />
                        <Button
                            type="button" variant="ghost" size="icon" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
                            onClick={() => handlePaste(setLabel)}
                            title="Paste from clipboard"
                        >
                            <ClipboardPaste className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Secret Key */}
                <div className="space-y-2 group/input">
                    <label htmlFor="secret" className="text-xs font-semibold ml-1 text-foreground/70 group-focus-within/input:text-primary transition-colors flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5" /> Secret Key
                    </label>
                    <div className="relative">
                        <Input
                        id="secret"
                        placeholder="Enter 2FA Secret"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        required
                        onClick={() => !secret && handlePaste(setSecret)}
                        className="h-12 font-mono uppercase bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all text-base pl-4 pr-10 rounded-xl"
                        />
                        <Button
                            type="button" variant="ghost" size="icon" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
                            onClick={() => handlePaste(setSecret)}
                            title="Paste from clipboard"
                        >
                            <ClipboardPaste className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Tags */}
            <div className="space-y-2 group/input">
               <label className="text-xs font-semibold ml-1 text-foreground/70 group-focus-within/input:text-primary transition-colors flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Tags
               </label>
               <div className="flex flex-col gap-3 p-3 rounded-xl bg-background/30 border border-border/30 focus-within:border-primary/30 focus-within:bg-background/50 transition-all">
                  <div className="flex flex-wrap gap-2 items-center min-h-[1.5rem]">
                      <AnimatePresence>
                        {tags.map(tag => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Badge variant="secondary" className="gap-1 pr-1 py-1 pl-2.5 rounded-lg bg-secondary/80 hover:bg-secondary">
                                    {tag}
                                    <div role="button" onClick={() => toggleTag(tag)} className="hover:bg-background/20 rounded-full p-0.5 ml-1 cursor-pointer transition-colors">
                                        <X className="h-3 w-3" />
                                    </div>
                                </Badge>
                            </motion.div>
                        ))}
                      </AnimatePresence>
                      <input 
                          className="flex-1 bg-transparent outline-none text-sm min-w-[80px] placeholder:text-muted-foreground/50 ml-1"
                          placeholder={tags.length === 0 ? "Add tags..." : ""}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                      />
                  </div>
                  
                  {availableTags.length > 0 && (
                       <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/20">
                           <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1 pt-1">Recent:</span>
                           {availableTags.filter(t => !tags.includes(t)).slice(0, 5).map(tag => (
                               <Badge 
                                  key={tag} 
                                  variant="outline" 
                                  className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all text-[10px] py-0.5 h-5 bg-background/50"
                                  onClick={() => toggleTag(tag)}
                              >
                                   + {tag}
                               </Badge>
                           ))}
                       </div>
                   )}
               </div>
            </div>

            <Button type="submit" disabled={!secret} className={cn(
                "h-12 text-base font-bold gap-2 w-full mt-2 rounded-xl transition-all shadow-lg shadow-primary/20",
                !secret ? "opacity-50 cursor-not-allowed" : "hover:shadow-primary/40 hover:-translate-y-0.5"
            )}>
              <Save className="h-5 w-5" /> Save
            </Button>
          </form>
      </div>
      
      {/* Decorative Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
    </div>
  );
}