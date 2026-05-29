import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { gifLibrary } from "../generated/gifManifest.js";
import GiftBox from "./GiftBox.jsx";
import ReactionGif from "./ReactionGif.jsx";

const prankTexts = [
  "Ohh Accah... qurbani? 😭",
  "Ami goru na 🙏",
  "Eid er din eto blood thrust?",
  "Mercy looks better on you🧛‍♀️",
  "Thik ache, gift open kori",
];

const totalSteps = 7;

function popConfetti() {
  confetti({
    particleCount: 95,
    spread: 74,
    origin: { y: 0.62 },
    colors: ["#ffe8a3", "#ffb6cc", "#cdb7ff", "#8ecae6", "#fff7df"],
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 55,
      origin: { x: 0.05, y: 0.75 },
      colors: ["#ffb6cc", "#ffe8a3", "#fff7df"],
    });
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 55,
      origin: { x: 0.95, y: 0.75 },
      colors: ["#cdb7ff", "#8ecae6", "#fff7df"],
    });
  }, 180);
}

function Progress({ step }) {
  return (
    <div className="progress-hearts" aria-label={`Step ${step + 1} of ${totalSteps}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <span
          key={index}
          className={index <= step ? "progress-heart active" : "progress-heart"}
        />
      ))}
    </div>
  );
}

function NextButton({ children = "Next", onClick }) {
  return (
    <motion.button
      type="button"
      className="primary-btn"
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.button>
  );
}

export default function EidCard() {
  const [step, setStep] = useState(0);
  const [qClicks, setQClicks] = useState(0);
  const [qOffset, setQOffset] = useState({ x: 0, y: 0 });
  const [showQurbani, setShowQurbani] = useState(true);
  const [qLocked, setQLocked] = useState(false);
  const [giftOpening, setGiftOpening] = useState(false);

  const gifs = useMemo(
    () => ({
      happy: gifLibrary.opening ?? gifLibrary.heart,
      intro: gifLibrary.intro ?? gifLibrary.opening,
      romantic: gifLibrary.romantic ?? gifLibrary.heart,
      calm: gifLibrary.calm ?? gifLibrary.romantic,
      panic: gifLibrary.panic ?? gifLibrary.spin,
      gift: gifLibrary.gift ?? gifLibrary.bow,
      final: gifLibrary.heart ?? gifLibrary.romantic,
    }),
    [],
  );

  const goNext = () => setStep((current) => Math.min(current + 1, totalSteps - 1));

  const handleQurbani = () => {
    if (qLocked) return;

    const nextClicks = qClicks + 1;
    setQClicks(nextClicks);
    setQOffset({
      x: Math.round((Math.random() - 0.5) * 92),
      y: Math.round((Math.random() - 0.5) * 64),
    });

    if (nextClicks >= prankTexts.length) {
      setQLocked(true);
      window.setTimeout(() => {
        setShowQurbani(false);
        setStep(5);
      }, 720);
    }
  };

  const openGift = () => {
    setGiftOpening(true);
    popConfetti();
    window.setTimeout(() => setStep(6), 850);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="step-content opening-step">
            <ReactionGif gif={gifs.happy} className="home-reaction" tilt="-4deg" />
            <h1>Eid Mubarak, Nivita 🧛‍♀️</h1>
            <p className="small-copy">MoNa made something worthless...</p>
            <NextButton onClick={goNext}>Open it</NextButton>
          </div>
        );
      case 1:
        return (
          <div className="step-content">
            <ReactionGif gif={gifs.intro} className="tiny-reaction" tilt="5deg" />
            <h2>Okay listen...</h2>
            <p>
              Normal Eid text pathai nai...
              <br />
              Tai ektu beshi overthink kore website banaise. 😭🙏
            </p>
            <NextButton onClick={goNext} />
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <ReactionGif gif={gifs.romantic} className="tiny-reaction" tilt="-4deg" />
            <h2>Dear Nivita 🧛‍♀️</h2>
            <p>
              Okay, Maybe everyone calls you by Nahar, but you are Nivita for
              me 🧛‍♀️✨
            </p>
            <p>
              Tomar 'Ohh Accah' ta randomly mathay ghure.
              <br />
              Eta normal na, ami jani.
            </p>
            <NextButton onClick={goNext} />
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <ReactionGif gif={gifs.calm} className="tiny-reaction" tilt="4deg" />
            <h2>Your personality</h2>
            <p>Tomar personality ta keno jani dark feminine character der moto.</p>
            <p>
              I know very little about you...
              <br />
              But, I know that much you are just as beautiful as your drawings.
            </p>
            <p className="small-copy">Also your music taste is ELITE😭</p>
            <NextButton onClick={goNext} />
          </div>
        );
      case 4:
        return (
          <div className="step-content choice-step">
            <ReactionGif gif={gifs.panic} className="tiny-reaction" tilt="-7deg" />
            <h2>Now choose your Eid fate</h2>
            <p>Ekhon decision tomar, Nivita 🧛‍♀️</p>
            <div className="choice-zone">
              <NextButton onClick={() => setStep(5)}>
                Build memories with Me
              </NextButton>
              <AnimatePresence>
                {showQurbani && (
                  <motion.button
                    key="qurbani"
                    type="button"
                    className="qurbani-btn"
                    disabled={qLocked}
                    onClick={handleQurbani}
                    animate={{
                      x: qOffset.x,
                      y: qOffset.y,
                      scale: Math.max(0.52, 1 - qClicks * 0.1),
                    }}
                    exit={{ opacity: 0, scale: 0.4, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 270, damping: 18 }}
                    whileTap={{ scale: Math.max(0.5, 0.94 - qClicks * 0.08) }}
                  >
                    {qClicks === 0
                      ? "Qurbani Me"
                      : prankTexts[Math.min(qClicks - 1, prankTexts.length - 1)]}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-content gift-step">
            <ReactionGif gif={gifs.gift} className="tiny-reaction gift-reaction" tilt="6deg" />
            <h2>Your gift is waiting</h2>
            <GiftBox opened={giftOpening} onClick={openGift} label="Tap to open" />
          </div>
        );
      default:
        return (
          <div className="step-content final-step">
            <ReactionGif gif={gifs.final} className="tiny-reaction" tilt="-5deg" />
            <h2>Eid Mubarak, Nivita 🧛‍♀️</h2>
            <div className="final-message">
              <p>Maybe amader huge memory nai yet.</p>
              <p>But maybe ei Eid ta first small page hote pare.</p>
              <p>
                A little chaos.
                <br />
                A little 'Ohh Accah'.
                <br />
                Maybe sea, sunsets, songs, drawings...
                <br />
                and maybe some memories we haven&apos;t made yet.
              </p>
              <p className="highlight-line">
                But I really think about you every day, scrolling through your
                profile. Though I don&apos;t message cause I don&apos;t wanna do
                anything without your consent.
              </p>
              <p>
                I like you.
                <br />
                No pressure.
                <br />
                Just wanted to make you smile.
              </p>
              <p>
                From,
                <br />
                MoNa 😭🙏
              </p>
            </div>
            <motion.a
              // TODO: Replace with Messenger or another WhatsApp link later if needed.
              href="https://wa.link/6lsa4p"
              className="primary-btn final-link"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.94 }}
            >
              Say Eid Mubarak back
            </motion.a>
            <p className="micro-copy">
              If you reply 'Ohh Accah', the patient will go heartattack.
            </p>
          </div>
        );
    }
  };

  return (
    <section className="phone-stage" aria-live="polite">
      <motion.div
        className="eid-card"
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <span className="card-doodle doodle-moon" />
        <span className="card-doodle doodle-star" />
        <span className="card-doodle doodle-heart-one" />
        <span className="card-doodle doodle-heart-two" />
        <span className="card-sticker sticker-ohh">Ohh Accah</span>
        <span className="card-sticker sticker-nivita">Nivita 🧛‍♀️</span>
        <motion.div
          key={step}
          className="step-shell"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.34, ease: "easeOut" }}
        >
          {renderStep()}
        </motion.div>
        <Progress step={step} />
      </motion.div>
    </section>
  );
}
