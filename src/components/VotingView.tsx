import React, { useState, useEffect } from 'react';
import type { User, Category } from '../types';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  AlertTriangle, 
  Send, 
  Trophy, 
  Flame, 
  Ghost,
  ShieldAlert,
  UserX
} from 'lucide-react';

interface VotingViewProps {
  currentUser: User;
  categories: Category[];
  onSubmitVote: (selections: Record<string, string>) => void;
  onGoToScoreboard?: () => void;
}

export const VotingView: React.FC<VotingViewProps> = ({
  currentUser,
  categories,
  onSubmitVote,
  onGoToScoreboard,
}) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Reiniciar selecciones si cambia el estado de hasVoted o de usuario
  useEffect(() => {
    if (!currentUser.hasVoted) {
      setSelections({});
      setErrorNotice(null);
    }
  }, [currentUser.id, currentUser.hasVoted]);

  // Si el usuario ya votó, mostrar vista de confirmación y bloqueo
  if (currentUser.hasVoted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-[#170a2c]/90 border border-purple-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Resplandores decorativos */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-purple-900 to-orange-500 border-2 border-orange-400 shadow-spooky-orange mx-auto animate-float">
              <span className="text-5xl">🎃</span>
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Votación Completada
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                ¡Ya enviaste tu calificación!
              </h2>
              <p className="text-purple-200/80 max-w-lg mx-auto text-sm sm:text-base">
                Hola <strong className="text-orange-400">{currentUser.name}</strong>, tu veredicto para el concurso de Halloween de <strong className="text-white">Atiempo</strong> ha sido registrado con éxito.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800/50 max-w-md mx-auto text-xs text-gray-300 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Por normas de imparcialidad, el sistema no permite modificar ni enviar votos adicionales.</span>
            </div>

            {/* Si es Gestión Humana o Admin, enlace para ver la tabla de puntuación */}
            {(currentUser.role === 'gh' || currentUser.role === 'admin') && onGoToScoreboard && (
              <div className="pt-4">
                <button
                  onClick={onGoToScoreboard}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-bold text-sm shadow-spooky-purple transition-transform hover:scale-105"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  Ver Tabla de Puntuaciones en Tiempo Real
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Manejador de selección de voto
  const handleSelectOption = (categoryId: string, option: string, isBlocked: boolean, blockReason?: string) => {
    if (isBlocked) {
      setErrorNotice(blockReason || 'Opción no permitida');
      return;
    }
    setErrorNotice(null);
    setSelections((prev) => ({
      ...prev,
      [categoryId]: option,
    }));
  };

  const totalCategories = categories.length;
  const answeredCount = Object.keys(selections).length;
  const isComplete = answeredCount === totalCategories;
  const isAdmin = currentUser.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdmin) {
      setErrorNotice('El Administrador no puede votar en el concurso, solo supervisar.');
      return;
    }

    if (!isComplete) {
      setErrorNotice('Por favor califica todas las categorías antes de enviar tu voto.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Disparar confetti de Halloween
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6200', '#9333ea', '#10b981', '#facc15', '#ffffff'],
      });

      onSubmitVote(selections);
    } catch (err: any) {
      setErrorNotice(err.message || 'Error al procesar el voto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      
      {/* Encabezado del Formulario de Votación */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          Concurso de Halloween Atiempo 2026
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Formulario Oficial de Votación 🎃
        </h1>
        <p className="text-purple-200/80 text-sm max-w-xl mx-auto">
          Participante: <strong className="text-white">{currentUser.name}</strong> • Tu equipo asignado: <strong className="text-orange-400">{currentUser.groupName}</strong>
        </p>

        {/* Notificación de Administrador si aplica */}
        {isAdmin && (
          <div className="max-w-xl mx-auto mt-2 p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Rol de Administrador:</strong> Esta pantalla es una vista previa. El administrador no emite votos para preservar la imparcialidad del concurso.
            </span>
          </div>
        )}

        {/* Barra de progreso */}
        <div className="max-w-md mx-auto pt-2">
          <div className="flex items-center justify-between text-xs text-purple-300 font-semibold mb-1">
            <span>Progreso de votación:</span>
            <span>{answeredCount} de {totalCategories} completadas</span>
          </div>
          <div className="w-full h-2.5 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800/60">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 shadow-spooky-orange"
              style={{ width: `${totalCategories > 0 ? (answeredCount / totalCategories) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {errorNotice && (
        <div className="max-w-2xl mx-auto flex items-center gap-3 p-4 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 text-sm animate-shake shadow-lg">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Listado de Categorías */}
      <div className="space-y-8">
        {categories.map((category, index) => {
          const isGroupCategory = category.type === 'group';
          const selectedOption = selections[category.id];

          return (
            <div
              key={category.id}
              className={`bg-[#160b26]/90 border rounded-3xl p-6 sm:p-8 transition-all duration-300 backdrop-blur-md shadow-xl ${
                selectedOption
                  ? 'border-purple-600/70 shadow-spooky-purple'
                  : 'border-purple-900/40 hover:border-purple-800/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-purple-900/50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {category.icon || (isGroupCategory ? '🏰' : '💀')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                        Pregunta {index + 1} • {isGroupCategory ? 'Votación Grupal (Equipos)' : 'Votación Individual (Personas)'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {category.title}
                    </h3>
                    <p className="text-xs text-purple-200/70 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                {selectedOption ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold self-start sm:self-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Seleccionado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold self-start sm:self-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Pendiente
                  </span>
                )}
              </div>

              {/* Opciones disponibles */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {category.options.map((option) => {
                  // Regla 1: En categorías grupales, NO puede votar por su propio equipo
                  const isSelfTeam =
                    isGroupCategory &&
                    option.toLowerCase().trim() === currentUser.groupName.toLowerCase().trim();

                  // Regla 2: En categorías individuales, NO puede votar por sí mismo
                  const isSelfPerson =
                    !isGroupCategory &&
                    (option.toLowerCase().trim() === currentUser.name.toLowerCase().trim() ||
                     option.toLowerCase().trim() === currentUser.username.toLowerCase().trim());

                  const isBlocked = isSelfTeam || isSelfPerson;
                  const isSelected = selectedOption === option;

                  if (isBlocked) {
                    return (
                      <div
                        key={option}
                        className="relative p-4 rounded-2xl bg-[#10061d]/60 border border-red-900/40 opacity-70 cursor-not-allowed group overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-400 line-through">
                              {option}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 mt-1">
                              <Lock className="w-3 h-3" />
                              {isSelfTeam ? 'Tu propio equipo' : 'Eres tú mismo(a)'}
                            </span>
                          </div>
                          <span className="text-lg opacity-40">🚫</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {isSelfTeam
                            ? '(Bloqueado: No puedes votar por tu propio grupo)'
                            : '(Bloqueado: No está permitido autovotarse)'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectOption(category.id, option, false)}
                      className={`relative p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-orange-950/80 to-purple-950/90 border-orange-500 shadow-spooky-orange scale-[1.02]'
                          : 'bg-[#1b0d30]/70 border-purple-900/50 hover:border-purple-600/80 hover:bg-[#251242]/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                          {option}
                        </span>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-purple-700/60 flex items-center justify-center shrink-0 text-transparent hover:border-orange-400">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span className={isSelected ? 'text-orange-300 font-bold' : 'text-purple-300/70'}>
                          {isSelected ? '✓ Voto Asignado' : 'Click para elegir'}
                        </span>
                        <span className="text-sm">
                          {isGroupCategory ? '👻' : '👑'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Botón de Enviar Votación */}
      <div className="pt-4 pb-12 flex flex-col items-center justify-center gap-3">
        {isAdmin ? (
          <div className="px-6 py-4 rounded-2xl bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold text-center max-w-md">
            👑 Eres Administrador. Puedes revisar todas las preguntas y la tabla de puntuación en tiempo real desde la barra lateral.
          </div>
        ) : (
          <>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className={`px-8 py-4 rounded-2xl font-black text-base flex items-center gap-3 transition-all duration-300 shadow-xl ${
                isComplete
                  ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-spooky-orange hover:scale-105 cursor-pointer'
                  : 'bg-purple-950/60 border border-purple-800/40 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Ghost className="w-5 h-5 animate-spin" />
                  Guardando tu votación...
                </>
              ) : isComplete ? (
                <>
                  <Send className="w-5 h-5" />
                  Sellar y Enviar Mi Votación Definitiva 🎃
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Completa las {totalCategories} preguntas para enviar ({answeredCount}/{totalCategories})
                </>
              )}
            </button>

            <p className="text-xs text-purple-300/70 text-center">
              ⚠️ Recuerda: Una vez que hagas clic en enviar, tu voto quedará sellado y no podrás votar nuevamente.
            </p>
          </>
        )}
      </div>

    </div>
  );
};
