"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const FormSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="container mx-auto py-8 space-y-6 animate-pulse"
    >
      {/* زر الرجوع */}
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded-full bg-gray-300" />
        <Skeleton className="h-5 w-32 bg-gray-300" />
      </div>

      {/* عنوان الصفحة */}
      <Skeleton className="h-8 w-48 rounded-md bg-gray-300" />

      {/* الشبكة الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* منطقة بناء النموذج */}
        <div className="w-full h-[500px] rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 shadow-md" />

        {/* الإعدادات الجانبية */}
        <div className="space-y-6">
          <Skeleton className="w-full h-48 rounded-lg bg-gray-200 shadow-sm" />
          <Skeleton className="w-full h-20 rounded-lg bg-gray-200 shadow-sm" />
          <Skeleton className="w-full h-12 rounded-lg bg-gray-200 shadow-sm" />
        </div>
      </div>
    </motion.div>
  );
};

export default FormSkeleton;
