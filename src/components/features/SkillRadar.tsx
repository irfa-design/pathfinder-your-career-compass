interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

interface SkillRadarProps {
  skills: SkillData[];
  className?: string;
}

export function SkillRadar({ skills, className = "" }: SkillRadarProps) {
  const size = 200;
  const center = size / 2;
  const maxRadius = size / 2 - 30;
  const levels = 5;

  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const pathData = skills
    .map((skill, index) => {
      const point = getPoint(index, skill.value);
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ") + " Z";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {Array.from({ length: levels }).map((_, i) => {
          const radius = ((i + 1) / levels) * maxRadius;
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          );
        })}

        {/* Axis lines */}
        {skills.map((_, index) => {
          const point = getPoint(index, 100);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Data points */}
        {skills.map((skill, index) => {
          const point = getPoint(index, skill.value);
          return (
            <circle
              key={skill.skill}
              cx={point.x}
              cy={point.y}
              r="4"
              className="fill-primary stroke-background stroke-2"
            />
          );
        })}

        {/* Labels */}
        {skills.map((skill, index) => {
          const point = getPoint(index, 120);
          return (
            <text
              key={skill.skill}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-xs font-medium"
            >
              {skill.skill}
            </text>
          );
        })}

        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
