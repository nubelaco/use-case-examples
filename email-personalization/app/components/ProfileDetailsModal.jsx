import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BriefcaseIcon, GraduationCapIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProfileDetailsModal = ({ isOpen, setIsOpen, viewDetails }) => {
  const [avatarPath, setAvatarPath] = useState("");

  const getRandomAvatar = () => {
    const avatarNumber = Math.floor(Math.random() * 16) + 1;
    return `/avatars/avatar-${avatarNumber}.svg`;
  };

  useEffect(() => {
    if (isOpen) {
      setAvatarPath(getRandomAvatar());
    }
  }, [isOpen]);

  if (!viewDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl bg-gray-100 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg sm:text-xl">
          <span className="truncate">
            Profile details of {`${viewDetails.full_name}`}
          </span>
        </DialogTitle>
        <DialogHeader>
          <DialogDescription>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <h1 className="font-semibold text-gray-800 text-md sm:text-lg">
                {viewDetails.full_name}
              </h1>
              <p className="text-sm sm:text-base">{viewDetails.headline}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                <span>{viewDetails.city && viewDetails.city}</span>
                <span>{viewDetails.state && `, ${viewDetails.state}`}</span>
                <span>{viewDetails.country && `, ${viewDetails.country}`}</span>
              </p>
            </div>

            {viewDetails.experiences.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    <Badge
                      variant="secondary"
                      className="px-2 py-1 text-sm font-semibold sm:text-base"
                    >
                      <BriefcaseIcon className="mr-2 w-4 h-4" />
                      Experiences
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {viewDetails.experiences.map((experience, index) => (
                      <div key={experience.title} className="pb-2 border-b last:border-b-0 last:pb-0">
                        <span className="block text-sm font-semibold text-gray-600 sm:text-base">{`${experience.title} at ${experience.company}`}</span>
                        <span className="block text-xs text-gray-500 sm:text-sm">
                          {experience.starts_at?.day &&
                            `${experience.starts_at.day}/${experience.starts_at.month}/${experience.starts_at.year} - `}

                          {experience.ends_at?.day
                            ? `${experience.ends_at.day}/${experience.ends_at.month}/${experience.ends_at.year}`
                            : "Present"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {viewDetails.education.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    <Badge
                      variant="secondary"
                      className="px-2 py-1 text-sm font-semibold sm:text-base"
                    >
                      <GraduationCapIcon className="mr-2 w-4 h-4" />
                      Education
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {viewDetails.education.map((education) => (
                      <div key={education.degree_name} className="pb-2 border-b last:border-b-0 last:pb-0">
                        <span className="block text-sm font-semibold text-gray-600 sm:text-base">{`${education.degree_name} in ${education.field_of_study} at ${education.school}`}</span>
                        <span className="block text-xs text-gray-500 sm:text-sm">
                          {education.starts_at?.day &&
                            `${education.starts_at.day}/${education.starts_at.month}/${education.starts_at.year} - `}

                          {education.ends_at?.day
                            ? `${education.ends_at.day}/${education.ends_at.month}/${education.ends_at.year}`
                            : "Present"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetailsModal
