"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import React, { createContext, useContext } from "react";

interface TabContextProps {
  activeValue: string;
}

const TabContext = createContext<TabContextProps | null>(null);

export default function Tab({
  value,
  onValueChange,
  children,
  ...props
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Tabs>) {
  const triggers = React.Children.toArray(children).filter(
    (
      child
    ): child is React.ReactElement<React.ComponentProps<typeof Tab.trigger>> =>
      React.isValidElement(child) && child.type === Tab.trigger
  );
  const contents = React.Children.toArray(children).filter(
    (
      child
    ): child is React.ReactElement<React.ComponentProps<typeof Tab.content>> =>
      React.isValidElement(child) && child.type === Tab.content
  );

  return (
    <TabContext.Provider value={{ activeValue: value }}>
      <Tabs
        value={value}
        onValueChange={onValueChange}
        className="w-full px-2 md:w-96"
        dir="rtl"
        {...props}
      >
        <TabsList className="flex gap-2 justify-around w-full">
          {triggers}
        </TabsList>
        {contents}
      </Tabs>
    </TabContext.Provider>
  );
}

function TabTrigger({
  value,
  children,
  ...props
}: {
  value: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof TabsTrigger>) {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("TabTrigger باید درون Tab استفاده شود");
  }
  const { activeValue } = context;

  return (
    <TabsTrigger
      value={value}
      className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none"
      {...props}
    >
      {activeValue === value && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-orange-200"
          transition={{ type: "spring", duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </TabsTrigger>
  );
}

function TabContent({
  value,
  children,
  ...props
}: {
  value: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof TabsContent>) {
  return (
    <TabsContent value={value} {...props}>
      {children}
    </TabsContent>
  );
}

Tab.trigger = TabTrigger;
Tab.content = TabContent;
