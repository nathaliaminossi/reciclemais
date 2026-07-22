import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Edit,
  CircleUserRound,
  UserRound,
  Fingerprint,
  Mail,
  Lock,
  Image as ImageIcon,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/authContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DataField from "@/components/dataField"
import DataPasswordField from "@/components/dataPasswordField"
import EditProfileModal from "@/components/editProfileModal"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUser } from "@/api/userHome"
import { deleteUser, updateUser } from "@/api/userConfig"
import { enqueueSnackbar } from "notistack"

export interface User {
  id: number
  name: string
  email: string
  cpf: string
  fotoPerfil?: string
}

export default function UserProfile() {
  const [openEditModal, setOpenEditModal] = useState(false)

  const navigate = useNavigate()
  const { userId, logout } = useAuth()
  const token = localStorage.getItem("token")

  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUser(Number(userId), String(token)),
    enabled: !!userId && !!token
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(Number(userId), String(token)),
    onSuccess: () => {
      logout()
      navigate("/regis")
    }
  })

  const updateMutation = useMutation({
    mutationFn: (update: Partial<User>) => updateUser(Number(userId), String(token), update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] }),
        enqueueSnackbar("user atualizado com sucesso!", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        })
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || "Erro ao atualizar user", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      })
    }
  })

  function hadleDelete() {
    deleteMutation.mutate()
  }

  function handlUpdate(update: Partial<User>) {
    updateMutation.mutate(update)
  }

  let perfilFoto = ""
  if (user?.fotoPerfil?.startsWith("https:")) {
    perfilFoto = user.fotoPerfil
  } else if (user?.fotoPerfil) {
    perfilFoto = "http://localhost:3000" + user?.fotoPerfil
  } else {
    perfilFoto = "https://plus.unsplash.com/premium_photo-1663962158765-982d6ad0d006?ixlib=rb-4.1.0&q=60&w=3000"
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <CircleUserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary/70">
              Conta
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Perfil e configurações
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card de foto / identidade */}
          <Card className="h-fit rounded-3xl border-border/60 shadow-sm transition hover:shadow-md lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
              <Avatar className="h-28 w-28 border-4 border-background shadow-lg ring-4 ring-primary/10 sm:h-32 sm:w-32">
                <AvatarImage src={perfilFoto} />
                <AvatarFallback className="text-2xl font-semibold">U</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {user?.name || "Perfil do usuário"}
                </h2>
                <p className="break-all text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenEditModal(true)}
                className="w-full gap-1.5 rounded-full"
              >
                <ImageIcon className="h-3.5 w-3.5" /> Alterar foto
              </Button>

              <Separator />

              <Button
                onClick={() => setOpenEditModal(true)}
                className="w-full gap-1.5 rounded-xl shadow-md shadow-primary/25"
              >
                <Edit className="h-4 w-4" /> Editar perfil
              </Button>
            </CardContent>
          </Card>

          {/* Coluna principal */}
          <div className="space-y-6 lg:col-span-2">
            {/* Informações pessoais */}
            <Card className="rounded-3xl border-border/60 shadow-sm transition hover:shadow-md">
              <CardContent className="space-y-5 p-6 sm:p-8">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Informações pessoais
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Seus dados de cadastro e acesso à conta
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setOpenEditModal(true)}
                    className="gap-1.5 self-start rounded-full sm:self-auto"
                  >
                    <Edit className="h-3.5 w-3.5" /> Editar
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4 transition hover:border-primary/30 hover:bg-secondary/50">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DataField title="Nome" info={user?.name ?? ""} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4 transition hover:border-primary/30 hover:bg-secondary/50">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Fingerprint className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DataField title="CPF" info={user?.cpf ?? ""} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4 transition hover:border-primary/30 hover:bg-secondary/50">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DataField title="Email" info={user?.email ?? ""} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4 transition hover:border-primary/30 hover:bg-secondary/50">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DataPasswordField title="Senha" info="••••••••" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card className="rounded-3xl border-border/60 shadow-sm transition hover:shadow-md">
              <CardContent className="space-y-3 p-6 sm:p-8">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Bio</h3>
                  <p className="text-xs text-muted-foreground">
                    Uma breve descrição sobre você, visível no seu perfil
                  </p>
                </div>
                <p className="rounded-2xl border border-border/60 bg-secondary/30 p-4 text-sm italic leading-relaxed text-muted-foreground">
                  {user?.bio
                    ? user?.bio
                    : "Hi, I'm a passionate developer focused on crafting great digital experiences."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Zona de perigo */}
        <Card className="mt-6 rounded-3xl border-destructive/30 bg-destructive/5 shadow-sm transition hover:shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <h3 className="text-base font-semibold text-destructive">Zona de perigo</h3>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-destructive/20 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-sm font-medium text-foreground">Deletar esta conta</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Ao deletar sua conta, todos os seus dados serão removidos permanentemente.
                  Essa ação não pode ser desfeita.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-destructive px-5 text-sm font-medium text-destructive-foreground shadow-sm transition hover:bg-destructive/90">
                  Deletar conta
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Você tem certeza que deseja deletar sua conta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação será permanente, confirme sua senha para prosseguir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground transition hover:bg-destructive/90"
                      onClick={hadleDelete}
                    >
                      Deletar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {openEditModal && user && (
        <EditProfileModal
          userData={user}
          onSave={handlUpdate}
          onClose={() => setOpenEditModal(false)}
        />
      )}
    </main>
  )
}