"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/language-context";
import { ArrowRight, Smartphone, Mail } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { language } = useLanguage();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md bg-background border border-foreground/15 p-6 sm:rounded-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo-mark.png" alt="DawaLens Logo" className="w-10 h-10 object-contain" />
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block">
                DawaLens ID
              </span>
              <DialogTitle className="text-2xl font-display mt-0.5">
                {language === "hi" ? "दवा लेंस में साइन इन करें" : "Sign In to DawaLens"}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {language === "hi"
              ? "अपनी सहेजी गई दवाओं और सुरक्षा रिपोर्टों तक पहुँचें।"
              : "Access your saved medication profiles, check histories, and alerts."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              ✓
            </div>
            <p className="font-display text-lg">
              {language === "hi" ? "सत्यापन कोड भेजा गया" : "Verification Code Dispatched"}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {language === "hi" ? "कृपया 6 अंकों का OTP दर्ज करें।" : "Check your device for the 6-digit confirmation pin."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex border border-foreground/10 rounded-lg p-1 bg-foreground/[0.02]">
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex-1 py-1.5 text-xs font-mono rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  method === "phone" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex-1 py-1.5 text-xs font-mono rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  method === "email" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email ID
              </button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground">
                {method === "phone" ? "Mobile Number (+91)" : "Email Address"}
              </Label>
              <Input
                type={method === "phone" ? "tel" : "email"}
                placeholder={method === "phone" ? "98765 43210" : "name@example.com"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="font-mono text-sm h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider"
            >
              {language === "hi" ? "ओटीपी प्राप्त करें" : "Request Instant OTP"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-[11px] text-center text-muted-foreground font-mono">
              By proceeding, you agree to DawaLens Terms of Use and Privacy Policy.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
