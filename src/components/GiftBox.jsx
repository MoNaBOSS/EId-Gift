import { motion } from "framer-motion";

export default function GiftBox({
  opened = false,
  onClick,
  label = "Tap to open",
  compact = false,
}) {
  const isButton = typeof onClick === "function";
  const Wrapper = isButton ? motion.button : motion.div;

  return (
    <Wrapper
      type={isButton ? "button" : undefined}
      aria-label={isButton ? label : undefined}
      onClick={onClick}
      className={`gift-box ${compact ? "gift-box-compact" : ""} ${
        opened ? "gift-box-open" : ""
      }`}
      whileHover={isButton ? { y: -4, scale: 1.02, rotate: -1 } : undefined}
      whileTap={isButton ? { scale: 0.95 } : undefined}
    >
      <span className="gift-loop gift-loop-left" />
      <span className="gift-loop gift-loop-right" />
      <motion.span
        className="gift-top"
        animate={opened ? { y: -38, rotate: -10 } : { y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      />
      <span className="gift-base" />
      <span className="gift-ribbon-v" />
      <span className="gift-ribbon-h" />
      <span className="gift-spark gift-spark-one" />
      <span className="gift-spark gift-spark-two" />
      {label && <span className="gift-label">{label}</span>}
    </Wrapper>
  );
}
