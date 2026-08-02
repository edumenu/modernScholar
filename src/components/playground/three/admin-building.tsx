"use client";

import { motion, type Transition } from "motion/react";

const INK = "var(--pg3-ink)";
const SAND = "var(--pg3-sand)";
const SAND_DEEP = "var(--pg3-sand-deep)";
const CLOUD = "var(--pg3-cloud)";
const MARIGOLD = "var(--pg3-marigold)";
const CORAL = "var(--pg3-coral)";
const GRASS = "var(--pg3-grass)";
const GRASS_DEEP = "var(--pg3-grass-deep)";
const SKY_SOFT = "var(--pg3-sky-soft)";
const TERRACOTTA = "var(--pg3-terracotta)";

const spring: Transition = { type: "spring", stiffness: 190, damping: 19 };

function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 46 },
    animate: { opacity: 1, y: 0 },
    transition: { ...spring, delay },
  };
}

function drop(delay: number) {
  return {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { ...spring, delay },
  };
}

function pop(delay: number) {
  return {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: { ...spring, stiffness: 300, damping: 16, delay },
    style: { transformBox: "fill-box", transformOrigin: "center" } as const,
  };
}

const COLUMN_XS = [366, 420, 486, 540];
const WING_WINDOW_XS = [180, 238, 296, 602, 660, 718];

function Column({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.g {...rise(delay)}>
      <rect x={x - 5} y={502} width={30} height={12} rx={3} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
      <rect x={x} y={354} width={20} height={150} rx={4} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
      <line x1={x + 7} y1={362} x2={x + 7} y2={496} stroke={SAND_DEEP} strokeWidth={2.5} />
      <line x1={x + 13} y1={362} x2={x + 13} y2={496} stroke={SAND_DEEP} strokeWidth={2.5} />
      <rect x={x - 5} y={342} width={30} height={14} rx={3} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
    </motion.g>
  );
}

function WingWindow({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g {...pop(delay)}>
      <rect x={x} y={y} width={36} height={48} rx={6} fill={SKY_SOFT} stroke={INK} strokeWidth={2.5} />
      <line x1={x + 18} y1={y + 2} x2={x + 18} y2={y + 46} stroke={INK} strokeWidth={2} />
      <line x1={x + 2} y1={y + 24} x2={x + 34} y2={y + 24} stroke={INK} strokeWidth={2} />
    </motion.g>
  );
}

function Tree({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.g {...pop(delay)}>
      <rect x={x - 7} y={500} width={14} height={58} rx={4} fill="#a9683b" stroke={INK} strokeWidth={2.5} />
      <circle cx={x - 26} cy={488} r={26} fill={GRASS} stroke={INK} strokeWidth={2.5} />
      <circle cx={x + 26} cy={488} r={26} fill={GRASS} stroke={INK} strokeWidth={2.5} />
      <circle cx={x} cy={462} r={34} fill={GRASS_DEEP} stroke={INK} strokeWidth={2.5} />
    </motion.g>
  );
}

function Cloud({ cx, cy, className, delay }: { cx: number; cy: number; className: string; delay: number }) {
  return (
    <motion.g {...pop(delay)}>
      <g className={className}>
        <ellipse cx={cx} cy={cy} rx={44} ry={20} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
        <ellipse cx={cx - 26} cy={cy + 6} rx={24} ry={13} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
        <ellipse cx={cx + 28} cy={cy + 7} rx={22} ry={12} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
      </g>
    </motion.g>
  );
}

export function AdminBuilding() {
  return (
    <svg
      viewBox="0 0 920 620"
      role="img"
      aria-label="Illustration of a collegiate administration building assembling itself"
      className="h-auto w-full overflow-visible"
    >
      {/* Sun */}
      <motion.g {...pop(1.55)}>
        <g className="pg3-sun-rays">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={806 + Math.cos(a) * 44}
                y1={92 + Math.sin(a) * 44}
                x2={806 + Math.cos(a) * 58}
                y2={92 + Math.sin(a) * 58}
                stroke={INK}
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <circle cx={806} cy={92} r={34} fill={MARIGOLD} stroke={INK} strokeWidth={2.5} />
      </motion.g>

      {/* Clouds */}
      <Cloud cx={150} cy={116} className="pg3-cloud-a" delay={1.5} />
      <Cloud cx={648} cy={70} className="pg3-cloud-b" delay={1.62} />

      {/* Lawn */}
      <motion.g {...rise(0.1)}>
        <ellipse cx={460} cy={578} rx={438} ry={34} fill={GRASS} stroke={INK} strokeWidth={2.5} />
      </motion.g>

      {/* Wings */}
      <motion.g {...rise(0.32)}>
        <rect x={158} y={400} width={182} height={162} fill={SAND} stroke={INK} strokeWidth={2.5} />
        <rect x={150} y={386} width={198} height={16} rx={4} fill={TERRACOTTA} stroke={INK} strokeWidth={2.5} />
      </motion.g>
      <motion.g {...rise(0.4)}>
        <rect x={580} y={400} width={182} height={162} fill={SAND} stroke={INK} strokeWidth={2.5} />
        <rect x={572} y={386} width={198} height={16} rx={4} fill={TERRACOTTA} stroke={INK} strokeWidth={2.5} />
      </motion.g>
      {WING_WINDOW_XS.map((x, i) => (
        <g key={x}>
          <WingWindow x={x} y={424} delay={0.9 + i * 0.05} />
          <WingWindow x={x} y={492} delay={1.05 + i * 0.05} />
        </g>
      ))}

      {/* Steps */}
      <motion.g {...rise(0.22)}>
        <rect x={330} y={538} width={260} height={14} rx={3} fill={SAND_DEEP} stroke={INK} strokeWidth={2.5} />
        <rect x={342} y={526} width={236} height={14} rx={3} fill={SAND_DEEP} stroke={INK} strokeWidth={2.5} />
        <rect x={354} y={514} width={212} height={14} rx={3} fill={SAND_DEEP} stroke={INK} strokeWidth={2.5} />
      </motion.g>

      {/* Hall back wall + door */}
      <motion.g {...rise(0.5)}>
        <rect x={348} y={344} width={224} height={170} fill={SAND} stroke={INK} strokeWidth={2.5} />
      </motion.g>
      <motion.g {...rise(0.62)}>
        <path
          d="M 438 514 L 438 442 Q 438 418 460 418 Q 482 418 482 442 L 482 514 Z"
          fill={INK}
          stroke={INK}
          strokeWidth={2.5}
        />
        <path
          d="M 444 514 L 444 444 Q 444 426 460 426 Q 476 426 476 444 L 476 514 Z"
          fill={MARIGOLD}
        />
        <line x1={460} y1={428} x2={460} y2={512} stroke={INK} strokeWidth={2.5} />
      </motion.g>

      {/* Columns */}
      {COLUMN_XS.map((x, i) => (
        <Column key={x} x={x} delay={0.5 + i * 0.09} />
      ))}

      {/* Entablature */}
      <motion.g {...drop(0.88)}>
        <rect x={340} y={314} width={240} height={30} rx={4} fill={SAND} stroke={INK} strokeWidth={2.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={358 + i * 19} cy={329} r={2.6} fill={INK} />
        ))}
      </motion.g>

      {/* Pediment */}
      <motion.g {...drop(1.0)}>
        <polygon points="332,314 588,314 460,224" fill={TERRACOTTA} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <polygon points="368,304 552,304 460,240" fill={SAND} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </motion.g>

      {/* Clock */}
      <motion.g {...pop(1.16)}>
        <circle cx={460} cy={280} r={20} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
        <circle cx={460} cy={280} r={2.4} fill={INK} />
        <line className="pg3-hand-min" x1={460} y1={280} x2={460} y2={266} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
        <line className="pg3-hand-hour" x1={460} y1={280} x2={469} y2={285} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      </motion.g>

      {/* Cupola */}
      <motion.g {...drop(1.14)}>
        <rect x={426} y={214} width={68} height={12} rx={3} fill={SAND_DEEP} stroke={INK} strokeWidth={2.5} />
        <rect x={434} y={170} width={52} height={46} rx={4} fill={CLOUD} stroke={INK} strokeWidth={2.5} />
        <rect x={444} y={180} width={8} height={26} rx={3} fill={INK} />
        <rect x={456} y={180} width={8} height={26} rx={3} fill={INK} />
        <rect x={468} y={180} width={8} height={26} rx={3} fill={INK} />
      </motion.g>
      <motion.g {...drop(1.28)}>
        <path d="M 428 172 Q 460 118 492 172 Z" fill={MARIGOLD} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <circle cx={460} cy={130} r={4.5} fill={INK} />
      </motion.g>

      {/* Flag */}
      <motion.g {...rise(1.42)}>
        <line x1={460} y1={126} x2={460} y2={64} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <polygon className="pg3-flag" points="462,68 512,79 462,90" fill={CORAL} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      </motion.g>

      {/* Trees */}
      <Tree x={96} delay={1.4} />
      <Tree x={824} delay={1.48} />

      {/* Shrubs by the steps */}
      <motion.g {...pop(1.35)}>
        <ellipse cx={310} cy={548} rx={26} ry={18} fill={GRASS_DEEP} stroke={INK} strokeWidth={2.5} />
        <ellipse cx={612} cy={548} rx={26} ry={18} fill={GRASS_DEEP} stroke={INK} strokeWidth={2.5} />
      </motion.g>
    </svg>
  );
}
