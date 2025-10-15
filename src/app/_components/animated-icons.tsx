import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const AnimatedIcon = () => {
    const { theme } = useTheme();
  return (
    <motion.div
      key={theme} // Important: re-triggers animation on theme change
      initial={{ rotate: -180 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4 text-zinc-900 dark:text-zinc-400" />
      ) : (
        <Sun className="w-4 h-4 text-primary" />
      )}
    </motion.div>
  );
};

export default AnimatedIcon
