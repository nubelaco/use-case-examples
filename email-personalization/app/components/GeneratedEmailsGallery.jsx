import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function GeneratedEmailsGallery({ generatedEmails }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 9;

  const handleCopy = (index) => {
    navigator.clipboard.writeText(generatedEmails[index]);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  if (!generatedEmails.length) return null;

  const totalPages = Math.ceil(generatedEmails.length / emailsPerPage);
  const startIndex = (currentPage - 1) * emailsPerPage;
  const displayedEmails = generatedEmails.slice(startIndex, startIndex + emailsPerPage);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Generated Emails</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedEmails.map((email, index) => (
          <Card key={startIndex + index} className="flex flex-col p-4 shadow-none">
            <p className="mb-2 text-sm text-gray-600">Generated email for {email.public_identifier}</p>
            <div className="mb-2 h-[200px] overflow-y-auto bg-gray-50 p-4 rounded-md border">
              <p className="text-sm whitespace-pre-wrap">{email.email}</p>
            </div>
            <Button
              className="ml-auto w-16"
              variant="outline"
              size="sm"
              onClick={() => handleCopy(startIndex + index)}
            >
              {(startIndex + index) === copiedIndex ? "Copied" : "Copy"}
            </Button>
          </Card>
        ))}
      </div>
      {generatedEmails.length > emailsPerPage && (
        <div className="flex justify-end items-center mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default GeneratedEmailsGallery;
