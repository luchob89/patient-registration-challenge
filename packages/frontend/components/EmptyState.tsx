import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-28 gap-5"
    >
      <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
        <Image src="/icons/user.svg" alt="" width={40} height={40} unoptimized />
      </div>
      <div>
        <p className="text-gray-700 font-semibold text-lg">
          No patients registered yet
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Add your first patient to get started.
        </p>
      </div>
      <Button value="Add Patient" onPress={onAdd} />
    </motion.div>
  );
}
