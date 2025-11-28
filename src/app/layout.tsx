import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import '@mantine/core/styles.css';
import "./globals.css";
import {createTheme, MantineProvider} from "@mantine/core";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Rishabh's PWS",
    description: "PWS",
};

const theme = createTheme({
    /** Put your mantine theme override here */
});

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider theme={theme}>
            {children}
        </MantineProvider>
        </body>
        </html>
    );
}
