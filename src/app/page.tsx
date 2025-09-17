'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { CheckCircle, Flag, Users, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-orange-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    A Clearer View of Your Community
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {APP_NAME} empowers you to report, track, and resolve civic
                    issues, connecting citizens with government for a better
                    tomorrow.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/citizen/report">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Report an Issue
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/1/600/400"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="community people working"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-primary">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                  A Simple Path to Resolution
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our streamlined process ensures your voice is heard and issues
                  are addressed efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">1</div>
                </div>
                <h3 className="text-lg font-bold">Report It</h3>
                <p className="text-sm text-muted-foreground">
                  Snap a photo, pick a location, and describe the issue. Our simple form makes reporting quick and easy.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">2</div>
                </div>
                <h3 className="text-lg font-bold">We Verify</h3>
                <p className="text-sm text-muted-foreground">
                  An engineer verifies the report, assesses the work needed, and estimates the cost for approval.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">3</div>
                </div>
                <h3 className="text-lg font-bold">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Follow the issue's journey from submission to resolution through your citizen dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                A Platform for Everyone
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {APP_NAME} brings together all stakeholders in the civic process.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <Card>
                <CardHeader className="flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  <CardTitle>For Citizens</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Easily report issues and track their status in real-time.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center gap-2">
                  <Flag className="w-8 h-8 text-primary" />
                  <CardTitle>For Government</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Manage, assign, and oversee the resolution of all reported issues.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center gap-2">
                  <Users className="w-8 h-8 text-primary" />
                  <CardTitle>For Contractors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Receive work orders and submit completion reports seamlessly.</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-col items-center gap-2">
                  <Shield className="w-8 h-8 text-primary" />
                  <CardTitle>For Managers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Approve projects, manage funds, and ensure accountability.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

         {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join your community in building a better, more responsive local government.
              </p>
            </div>
            <div className="mt-6">
                 <Link href="/citizen/report">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Report Your First Issue
                    </Button>
                  </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div className="col-span-2 lg:col-span-1">
                    <h4 className="font-bold text-lg mb-2 font-headline">{APP_NAME}</h4>
                    <p className="text-sm text-muted-foreground">
                        Empowering citizens to build better communities by reporting and tracking civic issues.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
                        <li><Link href="/citizen/dashboard" className="text-muted-foreground hover:text-primary">Citizen Dashboard</Link></li>
                        <li><Link href="/contractor/dashboard" className="text-muted-foreground hover:text-primary">Contractor Dashboard</Link></li>
                         <li><Link href="/login" className="text-muted-foreground hover:text-primary">Admin Login</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQs</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>support@civiclens.gov.in</li>
                        <li>Toll-Free: 1800-123-4567</li>
                    </ul>
                </div>
            </div>
            <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 {APP_NAME}. All rights reserved. Government of India.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
