import { useState, useRef } from "react";
import { Save, X, ClipboardPaste, KeyRound, User, Tag, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { TwoFactorAccount } from "@/hooks/use-2fa";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "usehooks-ts";

interface AddAccountFormProps {
  onAdd: (account: Omit<TwoFactorAccount, "id">) => void;
  availableTags: string[];
}

export function AddAccountForm({ onAdd, availableTags }: AddAccountFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [label, setLabel] = useState("");
  const [secret, setSecret] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const formRef = useRef<HTMLDivElement>(null);

  // Close form if clicked outside, but only if secret is empty (to prevent accidental data loss)
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, () => {
    if (isExpanded && !secret && !label) {
      setIsExpanded(false);
    }
  });

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

  const handleCancel = () => {
      setIsExpanded(false);
      setLabel("");
      setSecret("");
      setTags([]);
      setTagInput("");
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

    handleCancel(); // Close and reset
    toast.success("Account added successfully");
  };

  return (
    <div 
        ref={formRef}
        className={cn(
            "rounded-3xl border border-border/40 bg-card/30 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20 group",
            isExpanded ? "ring-2 ring-primary/20" : ""
        )}
    >
      <div className="p-1">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* Secret Key Input (Always Visible - Acts as Trigger) */}
            <div className="relative group/input p-1">
                <div className="relative">
                    <Input
                        id="secret"
                        placeholder={isExpanded ? "Paste your Secret Key here" : "Paste 2FA Secret Key to add new..."}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        onClick={() => !secret && handlePaste(setSecret)}
                        required
                        className={cn(
                            "h-14 font-mono uppercase bg-background/50 border-transparent focus:border-transparent transition-all text-base pl-12 pr-10 rounded-2xl shadow-none",
                            !isExpanded && "cursor-text hover:bg-background/80"
                        )}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        <KeyRound className={cn("h-5 w-5 transition-colors", isExpanded ? "text-primary" : "")} />
                    </div>
                    
                    {/* Paste/Collapse Button */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {isExpanded ? (
                             <Button
                                type="button" variant="ghost" size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <ChevronUp className="h-5 w-5" />
                            </Button>
                        ) : (
                             <Button
                                type="button" variant="ghost" size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl"
                                onClick={() => handlePaste(setSecret)}
                                title="Paste"
                            >
                                <ClipboardPaste className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Collapsible Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-2 pb-2 flex flex-col gap-4 pt-2">
                             {/* Account Name */}
                            <div className="relative group/input">
                                <div className="relative">
                                    <Input
                                    id="label"
                                    placeholder="Service Name (e.g. Google, Facebook)"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    onClick={() => !label && handlePaste(setLabel)}
                                    className="h-12 bg-background/40 border-border/50 focus:border-primary/50 focus:bg-background/60 transition-all text-base pl-12 pr-10 rounded-2xl"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <Button
                                        type="button" variant="ghost" size="icon" 
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
                                        onClick={() => handlePaste(setLabel)}
                                    >
                                        <ClipboardPaste className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-col gap-3 p-3 rounded-2xl bg-background/30 border border-border/30 focus-within:border-primary/30 focus-within:bg-background/50 transition-all">
                                <div className="flex flex-wrap gap-2 items-center min-h-[1.5rem]">
                                    <Tag className="h-4 w-4 text-muted-foreground mr-1" />
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
                                        className="flex-1 bg-transparent outline-none text-sm min-w-[80px] placeholder:text-muted-foreground/50 ml-1 h-6"
                                        placeholder={tags.length === 0 ? "Add tags..." : ""}
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                
                                {availableTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/20">
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

                            {/* Actions */}
                            <div className="flex gap-3 mt-1">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1 h-12 rounded-xl border-border/50 hover:bg-background/50"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={!secret} 
                                    className={cn(
                                        "flex-[2] h-12 text-base font-bold gap-2 rounded-xl transition-all shadow-lg shadow-primary/20",
                                        !secret ? "opacity-50 cursor-not-allowed" : "hover:shadow-primary/40 hover:-translate-y-0.5"
                                    )}
                                >
                                    <Save className="h-5 w-5" /> Save Authenticator
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </form>
      </div>
    </div>
  );
}
