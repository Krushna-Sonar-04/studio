
'use client';

import { Button } from '@/components/ui/button';
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
import { useLanguage } from '@/contexts/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <QrCode className="w-10 h-10 text-primary" />,
      title: t('feature_qr_title'),
      description: t('feature_qr_desc'),
    },
    {
      icon: <MapPin className="w-10 h-10 text-primary" />,
      title: t('feature_map_title'),
      description: t('feature_map_desc'),
    },
    {
      icon: <Languages className="w-10 h-10 text-primary" />,
      title: t('feature_multilingual_title'),
      description: t('feature_multilingual_desc'),
    },
    {
      icon: <Vote className="w-10 h-10 text-primary" />,
      title: t('feature_upvote_title'),
      description: t('feature_upvote_desc'),
    },
    {
      icon: <Trophy className="w-10 h-10 text-primary" />,
      title: t('feature_leaderboard_title'),
      description: t('feature_leaderboard_desc'),
    },
    {
      icon: <BellRing className="w-10 h-10 text-primary" />,
      title: t('feature_broadcasts_title'),
      description: t('feature_broadcasts_desc'),
    },
    {
      icon: <TimerReset className="w-10 h-10 text-primary" />,
      title: t('feature_sla_title'),
      description: t('feature_sla_desc'),
    },
    {
      icon: <Database className="w-10 h-10 text-primary" />,
      title: t('feature_bulk_upload_title'),
      description: t('feature_bulk_upload_desc'),
    },
  ];

  return (
    <div className="bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                    {t('landing_hero_title')}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('landing_hero_subtitle')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {t('get_started')}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last">
                <Image
                    src="https://media.istockphoto.com/id/1461650610/photo/group-of-audience-at-stadium-shouting-screaming-for-win-by-holding-indian-flags-while.jpg?s=2048x2048&w=is&k=20&c=-ZHH4VJw5ngoHOwl3D24UOQTI7ZD52Pyju5RM5z-H7U="
                    fill
                    alt="A diverse group of people from an Indian community working together."
                    priority
                    className="object-cover"
                    data-ai-hint="indian community"
                />
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                  {t('latest_features')}
                </div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                  {t('features_title')}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('features_subtitle', { appName: APP_NAME })}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:max-w-none">
                {features.map((feature) => (
                    <div key={feature.title} className="grid gap-2 text-center">
                        <div className="flex justify-center">{feature.icon}</div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground">
                        {feature.description}
                        </p>
                    </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
