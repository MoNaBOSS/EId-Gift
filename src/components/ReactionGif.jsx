import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function resolveGifSrc(src) {
  if (!src || /^(https?:|data:|blob:)/i.test(src)) {
    return src;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedSrc = src.replace(/^\//, "");

  return `${normalizedBase}/${normalizedSrc}`;
}

function MiniPlaceholder() {
  return (
    <motion.div
      className="reaction-placeholder"
      initial={{ opacity: 0, scale: 0.86, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: -5 }}
    >
      gif loading
    </motion.div>
  );
}

export default function ReactionGif({
  gif,
  alt = "Cute anime reaction",
  className = "",
  tilt = "-5deg",
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveGifSrc(gif?.src);

  useEffect(() => {
    setFailed(false);
  }, [gif?.src]);

  if (!resolvedSrc || failed) {
    return <MiniPlaceholder />;
  }

  return (
    <motion.figure
      className={`reaction-gif ${className}`}
      style={{ "--tilt": tilt }}
      initial={{ opacity: 0, scale: 0.82, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: tilt }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
    >
      <img src={resolvedSrc} alt={alt} onError={() => setFailed(true)} />
    </motion.figure>
  );
}
