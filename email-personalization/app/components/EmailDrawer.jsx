import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

function EmailDrawer({
  isOpen,
  setIsOpen,
  setSelectedLead,
  data,
  setGeneratedEmails,
}) {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSavePersonalizedEmail = (personalizedEmail, profile) => {
    const generatedEmails =
      JSON.parse(localStorage.getItem("generatedEmails")) || [];

    localStorage.setItem(
      "generatedEmails",
      JSON.stringify([
        ...generatedEmails,
        {
          email: personalizedEmail,
          public_identifier: profile.public_identifier,
        },
      ]),
    );

    setGeneratedEmails((prev) => [
      ...prev,
      {
        email: personalizedEmail,
        public_identifier: profile.public_identifier,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const responses = await Promise.all(
        data.map((profile) =>
          fetch(`/api/generateEmail`, {
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
      results.forEach((email, index) => {
        handleSavePersonalizedEmail(email, data[index]);
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
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Bulk generate personalized emails</SheetTitle>
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
            className="text-sm text-blue-500 underline hover:text-blue-600"
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

          <div>
            <span className="whitespace-nowrap">Generate email for </span>
            {data.map((profile, index) => (
              <span className="font-bold" key={profile.public_identifier}>
                {profile.full_name}
                {index < data.length - 1 && ", "}
              </span>
            ))}
          </div>

          <Button onClick={handleSubmit}>
            {isLoading ? (
              "Generating..."
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Bulk generate emails</span>
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EmailDrawer;
