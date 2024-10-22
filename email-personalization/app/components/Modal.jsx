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
const Modal = ({ isOpen, setIsOpen, leadsProfile, setLeadsProfile, handleSubmit,isLoading }) => {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl p-6">
        <DialogTitle className="text-2xl font-bold text-gray-800">Import Leads by LinkedIn Profile URL</DialogTitle>
        <span className="text-sm text-gray-500">Accepted format is https://www.linkedin.com/in/[username]</span>
        <span className="text-sm text-gray-500">For example https://www.linkedin.com/in/williamhgates/</span>
        <DialogHeader>
          <h2 className="text-lg text-gray-600 font-semibold mt-2">Enter one LinkedIn Profile URL per line</h2>
        </DialogHeader>
        <div className="flex">
          <div className="mr-2">
            {leadsProfile.split("\n").map((_, index) => (
              <div key={index} className="text-gray-500 py-1 text-xs">
                {index + 1}
              </div>
            ))}
          </div>
          <Textarea
            placeholder="Type your message here."
            value={leadsProfile}
            onChange={(e) => setLeadsProfile(e.target.value)}
            className="border rounded-md p-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <Button className="mt-4 mr-auto transition duration-200" onClick={handleSubmit}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
