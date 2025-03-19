"use client";

import Link from "next/link";
import Image from "next/image";
import { StaticImageData } from "next/image";

export interface DashboardCardProps {
  title: string;
  count: string;
  description: string;
  link: string;
  imageSrc: string | StaticImageData;
}

export default function DashboardCard({ 
  title, 
  count, 
  description, 
  link,
  imageSrc
}: DashboardCardProps) {
  return (
    <Link href={link} className="h-full">
      <div className="bg-white rounded-lg shadow-md p-0 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-2 border-slate-300 flex flex-col h-[600px]">
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
          <p className="text-4xl font-bold my-2">{count}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
} 