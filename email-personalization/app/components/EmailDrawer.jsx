import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import Link from "next/link";

function EmailDrawer({
  isOpen,
  setIsOpen,
  selectedLead,
  setSelectedLead,
  data,
  isBulkEmail,
  setIsBulkEmail,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmails, setGeneratedEmails] = useState([]);

  useEffect(() => {
    setGeneratedEmails(
      JSON.parse(localStorage.getItem("generatedEmails")) || [],
    );
  }, []);

  const initialPrompt = `You are professional sales with skills in cold outreach.

  Please customize the following email template with the attached LinkedIn profile data. Please be consise and return the populated email template only.

Hi <FIRST_NAME>

<SOMETHING INTERESTING FROM PROFILE DATA AT LEAST 2 SENTENCES> Will a LinkedIn Scraping API be useful for your  needs?`;

  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSavePersonalizedEmail = (personalizedEmail) => {
    const generatedEmails =
      JSON.parse(localStorage.getItem("generatedEmails")) || [];

    localStorage.setItem(
      "generatedEmails",
      JSON.stringify([...generatedEmails, personalizedEmail]),
    );

    setGeneratedEmails((prev) => [...prev, personalizedEmail]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const responses = await Promise.all(
        data.map((profile) =>
          // fetch(`/api/generateEmail`, {
          fetch(`/api/mockGenerateEmail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, profileJSON: profile }),
          }),
        ),
      );

      const results = await Promise.all(
        responses.map((response) => response.json()),
      );
      results.forEach((email) => {
        handleSavePersonalizedEmail(email);
      });
    } catch (error) {
      console.error("Error fetching email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSelectedLead(null);
      setIsBulkEmail(false);
    }
  };

 
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (index) => {
    navigator.clipboard.writeText(generatedEmails[index]);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            {isBulkEmail
              ? "Bulk generate personalized emails"
              : "Generate personalized email"}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <span className="text-sm text-gray-500">
            Variables reference:{" "}
            <i className="font-bold">
              first_name, last_name, full_name, headline, summary, company,
              company_url, city, state, country, experiences, educations, skills
              and many more.
            </i>
          </span>
          <Link
            className="text-blue-500 hover:text-blue-600 text-sm underline"
            href="https://nubela.co/proxycurl/docs#people-api-person-profile-endpoint"
            target="_blank"
          >
            Read more
          </Link>
          <Textarea
            placeholder="Type your prompt here."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-[300px] overflow-y-auto"
          />

          {isBulkEmail && (
            <div>
              <span className="whitespace-nowrap">Generate email for </span>
              {data.map((profile, index) => (
                <span className="font-bold" key={profile.public_identifier}>
                  {profile.full_name}
                  {index < data.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
          <Button onClick={handleSubmit}>
            {isLoading ? "Generating..." : "Generate personalized email"}
          </Button>
          {generatedEmails.length > 0 && (
            <>
              {generatedEmails.map((email, index) => (
                <div key={index} className="flex flex-col">
                  <Textarea
                    value={email}
                    className="h-[200px] overflow-y-auto"
                    disabled
                  />

                  <Button
                    className="my-2 ml-auto w-24"
                    onClick={() => handleCopy(index)}
                  >
                    {index === copiedIndex ? "Copied" : "Copy"}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EmailDrawer;
