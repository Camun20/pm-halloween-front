import React, { useState } from 'react';
import { 
  LogIn, 
  Lock, 
  User, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginModalProps {
  onLoginWithCredentials: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginWithCredentials,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!usernameInput.trim()) {
      setErrorMessage('Por favor ingresa tu nombre de usuario');
      return;
    }

    if (!passwordInput.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onLoginWithCredentials(usernameInput.trim(), passwordInput.trim());
      if (!result.success) {
        setErrorMessage(result.error || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      setErrorMessage('Error al verificar credenciales: ' + (err.message || 'Intente nuevamente'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100dvh-5.5rem)] sm:h-[calc(100vh-6rem)] max-h-[100dvh] flex flex-col justify-between items-center px-3 py-2 sm:py-4 overflow-hidden">
      
      {/* Contenedor central de la tarjeta de Login */}
      <div className="my-auto w-full max-w-sm sm:max-w-md bg-[#160b26]/95 border border-purple-800/70 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Luz decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-purple-600 shadow-spooky-orange" />

        <div className="space-y-4 sm:space-y-5">
          {/* Calabaza, Logo en colores vivos y etiqueta HALLOWEEN 2026 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2.5">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-900 border-2 border-orange-400 shadow-spooky-orange shrink-0 animate-float">
                <span className="text-2xl sm:text-3xl">🎃</span>
              </div>
              <img
                src="/images/logo-halloween.png"
                alt="Logo"
                className="h-10 sm:h-14 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(255,102,0,0.65)]"
              />
            </div>

            {/* Etiqueta idéntica al estilo SPOOKY 2026 */}
            <span className="text-[10px] sm:text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 tracking-widest shadow-sm">
              HALLOWEEN 2026
            </span>
          </div>

          <div className="text-center space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Iniciar Sesión
            </h2>
            <p className="text-[11px] sm:text-xs text-purple-200/70 max-w-xs mx-auto">
              Ingresa con tu usuario y contraseña asignados para votar.
            </p>
          </div>

          {/* Formulario de Inicio de Sesión */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            {/* Campo Usuario */}
            <div className="space-y-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-300">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Ingrese su usuario"
                  className="w-full bg-[#0d0617] border border-purple-800/70 rounded-xl pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-300">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Ingrese su contraseña..."
                  className="w-full bg-[#0d0617] border border-purple-800/70 rounded-xl pl-9 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensaje de Error */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-spooky-orange hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {isLoading ? 'Comprobando acceso...' : 'Entrar a las Votaciones 🎃'}
            </button>
          </form>

          {/* Ayuda o nota de acceso */}
          <div className="text-center pt-1">
            <p className="text-[10px] sm:text-[11px] text-purple-300/60">
              ¿No tienes tus credenciales? Contacta a <strong className="text-purple-300">Gestión Humana</strong>.
            </p>
          </div>

        </div>
      </div>

      {/* Pie de derechos de autor integrado fijamente sin scroll */}
      <footer className="w-full text-center text-[10px] sm:text-xs text-purple-300/60 py-1 shrink-0">
        <p>© 2026 Halloween Awards • Sistema Oficial de Votación</p>
      </footer>

    </div>
  );
};
