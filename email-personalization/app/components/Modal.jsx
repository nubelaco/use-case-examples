import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Modal = ({ isOpen, setIsOpen, leadsProfile, setLeadsProfile, handleSubmit, isLoading }) => {
  const hasInput = leadsProfile.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-6 max-w-xl">
        <DialogTitle className="text-xl font-bold text-gray-800">
          Import Leads by LinkedIn Profile URL
        </DialogTitle>
        <p className="mb-0 text-sm text-gray-500">
          Accepted format is https://www.linkedin.com/in/[username]
        </p>
        <p className="mb-0 text-sm text-gray-500">
          For example <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">https://www.linkedin.com/in/williamhgates/</span>
        </p>

        <div className={cn("space-y-2", "mt-0")}>
          <h2 className="text-base font-semibold text-gray-600">
            Enter one LinkedIn Profile URL per line
          </h2>
          <div className="flex">
            {hasInput && (
              <div className="mr-2">
                {leadsProfile.split("\n").map((_, index) => (
                  <div key={index} className="py-1 text-xs text-gray-500">
                    {index + 1}
                  </div>
                ))}
              </div>
            )}
            <Textarea
              placeholder="Type your message here."
              value={leadsProfile}
              onChange={(e) => setLeadsProfile(e.target.value)}
              className="p-2 w-full placeholder-gray-400 text-gray-700 rounded-md border"
            />
          </div>
        </div>

        <div className="flex justify-end items-center space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="transition duration-200" onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
