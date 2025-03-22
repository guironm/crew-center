"use client";

import Link from "next/link";
import Image from "next/image";
import { StaticImageData } from "next/image";
import AnimatedCounter from "../../components/ui/AnimatedCounter";
import { motion } from "framer-motion";

export interface DashboardCardProps {
  title: string;
  count: number;
  description: string;
  link: string;
  imageSrc: string | StaticImageData;
  delay?: number;
}

export default function DashboardCard({
  title,
  count,
  description,
  link,
  imageSrc,
  delay = 0,
}: DashboardCardProps) {
  return (
    <Link href={link} className="h-full">
      <motion.div 
        className="bg-white rounded-lg shadow-md p-0 hover:shadow-lg hover:bg-indigo-50 hover:border-slate-600 hover:translate-y-[-8px] transition-all duration-300 cursor-pointer border-2 border-slate-300 flex flex-col h-[600px] overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay,
          ease: "linear" 
        }}
      >
        <div className="relative w-full h-4/5 rounded-t-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 flex flex-col justify-center flex-grow">
          <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          <div className="text-4xl font-bold my-2">
            <AnimatedCounter to={count} />
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
