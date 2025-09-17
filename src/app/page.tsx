'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import {
  BellRing,
  Database,
  Languages,
  MapPin,
  QrCode,
  TimerReset,
  Trophy,
  Vote,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {

  const features = [
    {
      icon: <QrCode className="w-8 h-8 text-primary" />,
      title: 'QR Code Reporting',
      description: 'Scan location-based QR codes to instantly report issues.',
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: 'Nearby Issues Map',
      description: 'Discover civic issues around you in real time.',
    },
    {
      icon: <Languages className="w-8 h-8 text-primary" />,
      title: 'Multilingual Support',
      description: 'Available in English, Hindi, and Marathi for wider access.',
    },
    {
      icon: <Vote className="w-8 h-8 text-primary" />,
      title: 'Upvote System',
      description: 'Prioritize issues with public votes to drive faster action.',
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: 'Leaderboard & Impact',
      description: 'Recognize active reporters and see your impact count.',
    },
    {
      icon: <BellRing className="w-8 h-8 text-primary" />,
      title: 'Broadcasts & Alerts',
      description: 'Stay informed about local events and issue resolutions.',
    },
    {
      icon: <TimerReset className="w-8 h-8 text-primary" />,
      title: 'SLA & Reminder System',
      description: 'Auto-notifications for issue escalation & deadline tracking.',
    },
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: 'Admin Bulk Upload',
      description: 'Easily manage contractors and locations from the backend.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-24 pb-12 md:pt-32 md:pb-24 lg:pt-48 lg:pb-32">
          <div className="absolute inset-0 z-0">
             <Image
                src="https://picsum.photos/seed/civic/1200/700"
                layout="fill"
                objectFit="cover"
                alt="Vibrant city"
                className="opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
                  A New Lens on Civic Engagement
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Empower your voice. Report, track, and improve your city — all in one place.
                </p>
              </div>
              <div className="space-x-4">
                 <Link href="/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
                <a href="#features">
                    <Button size="lg" variant="link">
                        How it Works
                    </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Latest Features
                </div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                  Redefining Civic Involvement
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From QR-based issue tagging to multilingual support, {APP_NAME} is built for every citizen.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 sm:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:max-w-none">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center justify-start text-center p-4 transition-transform transform hover:-translate-y-2">
                    <CardHeader className="p-2">
                        {feature.icon}
                    </CardHeader>
                    <CardContent className="p-2">
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                        {feature.description}
                        </p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
