import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud,
  ImagePlus,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  ScanEye,
  Award,
  ShieldCheck,
} from "lucide-react";

/**
 * ---------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------
 * This shape is what a real API call to the AI verification endpoint should
 * eventually resolve to. Everything below is UI-only: swap `mockAnalyze`
 * for a real fetch/axios call and the rest of the component keeps working.
 */
type AnalysisStatus = "idle" | "loading" | "success" | "rejected";

interface AnalysisSuccess {
  status: "success";
  material: string;
  confidence: number; // 0-100
  pointsEarned: number;
}

interface AnalysisRejected {
  status: "rejected";
  reason: string;
}

type AnalysisResult = AnalysisSuccess | AnalysisRejected;

/**
 * ---------------------------------------------------------------------------
 * Mocked "AI" call — replace with a real request later.
 * Keeping the same async signature (File -> Promise<AnalysisResult>) means
 * the rest of the UI never has to change when the real endpoint is wired up.
 * ---------------------------------------------------------------------------
 */
async function mockAnalyze(_file: File): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const approved = Math.random() > 0.35;

  if (approved) {
    return {
      status: "success",
      material: "Plástico PET",
      confidence: 92,
      pointsEarned: 10,
    };
  }

  return {
    status: "rejected",
    reason:
      "Não foi possível identificar um material reciclável válido na imagem enviada.",
  };
}

/**
 * ---------------------------------------------------------------------------
 * UploadZone — drag & drop + click-to-upload + preview
 * ---------------------------------------------------------------------------
 */
function UploadZone({
  previewUrl,
  onFileSelected,
  disabled,
}: {
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith("image/")) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/30 hover:bg-muted/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previewUrl ? (
        <div className="w-full">
          <img
            src={previewUrl}
            alt="Pré-visualização da evidência"
            className="mx-auto max-h-64 rounded-xl object-contain shadow-sm"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Clique ou arraste uma nova imagem para substituir
          </p>
        </div>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UploadCloud className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Clique para enviar sua foto
            </p>
            <p className="text-sm text-muted-foreground">ou arraste e solte aqui</p>
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG até 10MB</p>
        </>
      )}
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * AnalysisCard — right column, one visual state per analysis phase
 * ---------------------------------------------------------------------------
 */
function AnalysisCard({
  status,
  result,
  progress,
  onConfirm,
  onRetry,
}: {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  progress: number;
  onConfirm: () => void;
  onRetry: () => void;
}) {
  if (status === "idle") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border">
          <ScanEye className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Envie uma imagem para iniciar a análise
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            O resultado da verificação por IA aparecerá aqui
          </p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card p-10 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <div className="w-full max-w-xs">
          <p className="font-semibold text-foreground">
            A IA está analisando sua evidência...
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Isso leva apenas alguns segundos
          </p>
          <Progress value={progress} className="mt-4 h-2" />
        </div>
      </div>
    );
  }

  if (status === "success" && result?.status === "success") {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-primary/30 bg-primary/5 p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aprovado
          </span>
        </div>

        <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-foreground">
          Reciclagem verificada com sucesso!
        </h3>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-sm">
            <span className="text-sm text-muted-foreground">
              Material identificado
            </span>
            <span className="font-semibold text-foreground">
              {result.material}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-sm">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Nível de confiança
            </span>
            <span className="font-semibold text-foreground">
              {result.confidence}%
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-sm">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              Pontos obtidos
            </span>
            <span className="font-semibold text-primary">
              +{result.pointsEarned} pontos
            </span>
          </div>
        </div>

        <Button onClick={onConfirm} className="mt-6 w-full gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Confirmar registro
        </Button>
      </div>
    );
  }

  if (status === "rejected" && result?.status === "rejected") {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-orange-300/60 bg-orange-50 p-8 dark:border-orange-900/40 dark:bg-orange-950/20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-200/60 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
            <XCircle className="h-3.5 w-3.5" />
            Não aprovado
          </span>
        </div>

        <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-200/60 dark:bg-orange-900/40">
          <XCircle className="h-8 w-8 text-orange-600 dark:text-orange-300" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-foreground">
          Não foi possível validar a evidência
        </h3>

        <div className="mt-5 rounded-xl bg-card px-4 py-3 shadow-sm">
          <p className="text-sm text-muted-foreground">Motivo retornado</p>
          <p className="mt-1 text-sm text-foreground">{result.reason}</p>
        </div>

        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 w-full gap-2 border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-950/40"
        >
          <ImagePlus className="h-4 w-4" />
          Enviar outra imagem
        </Button>
      </div>
    );
  }

  return null;
}

/**
 * ---------------------------------------------------------------------------
 * Main section — plugs into the Materials page between the carousel and
 * the materials table.
 * ---------------------------------------------------------------------------
 */
export default function EvidenceVerificationSection() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selected: File) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("idle");
    setResult(null);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setResult(null);
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus("loading");
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 220);

    try {
      const response = await mockAnalyze(file);
      clearInterval(interval);
      setProgress(100);
      setResult(response);
      setStatus(response.status);
    } catch {
      clearInterval(interval);
      setStatus("rejected");
      setResult({
        status: "rejected",
        reason: "Ocorreu um erro ao processar a análise. Tente novamente.",
      });
    }
  };

  const handleConfirm = () => {
    // Placeholder for the future "confirm registration" API call.
    console.log("Registro confirmado:", result);
  };

  return (
    <section className="rounded-3xl border border-border bg-background p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Verificação por IA
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column — upload */}
        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            Registrar evidência
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Envie uma foto do material reciclado para que nossa IA verifique
            se ele é válido e calcule os pontos que você pode ganhar.
          </p>

          <div className="mt-5">
            <UploadZone
              previewUrl={previewUrl}
              onFileSelected={handleFileSelected}
              disabled={status === "loading"}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2"
              disabled={status === "loading"}
              onClick={() => document.getElementById("evidence-file-input")?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              Selecionar imagem
            </Button>

            <Button
              className="gap-2"
              disabled={!file || status === "loading"}
              onClick={handleAnalyze}
            >
              <Sparkles className="h-4 w-4" />
              Analisar com IA
            </Button>

            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-destructive"
              disabled={!file || status === "loading"}
              onClick={handleRemoveImage}
            >
              <Trash2 className="h-4 w-4" />
              Remover imagem
            </Button>
          </div>

          {/* Hidden input reused by the "Selecionar imagem" button */}
          <input
            id="evidence-file-input"
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFileSelected(selected);
            }}
          />
        </div>

        {/* Right column — analysis result */}
        <div>
          <AnalysisCard
            status={status}
            result={result}
            progress={progress}
            onConfirm={handleConfirm}
            onRetry={handleRemoveImage}
          />
        </div>
      </div>
    </section>
  );
}