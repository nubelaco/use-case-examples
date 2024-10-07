import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Modal = ({ isOpen, setIsOpen, viewDetails }) => {
  if (!viewDetails) return null;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl">
        <DialogTitle>
          <span className="truncate">{`${viewDetails.profile.full_name} - ${viewDetails.profile?.headline}`}</span>
        </DialogTitle>
        <DialogHeader>
          <DialogDescription>
            <span className="truncate text-sm">
              <span>
                {viewDetails.profile.city && viewDetails.profile.city}
              </span>
              <span>
                {viewDetails.profile.state && `, ${viewDetails.profile.state}`}
              </span>
              <span>
                {viewDetails.profile.country &&
                  `, ${viewDetails.profile.country}`}
              </span>
            </span>

            {viewDetails.profile.experiences.length > 0 && (
              <>
                <h2 className="text-lg font-bold mt-6 mb-2">Experiences</h2>

                <div className="flex flex-col gap-2">
                  {viewDetails.profile.experiences.map((experience, index) => (
                    <div key={experience.title}>
                      <span
                        key={index}
                        className="block text-sm text-gray-600 font-semibold"
                      >{`${experience.title} at ${experience.company}`}</span>
                      <span className="block text-sm text-gray-500">
                        {experience.starts_at?.day &&
                          `${experience.starts_at.day}/${experience.starts_at.month}/${experience.starts_at.year} - `}

                        {experience.ends_at?.day
                          ? `${experience.ends_at.day}/${experience.ends_at.month}/${experience.ends_at.year}`
                          : "Present"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {viewDetails.profile.education.length > 0 && (
              <>
                <h2 className="text-lg font-bold mt-6 mb-2">Education</h2>
                <div className="flex flex-col gap-2">
                  {viewDetails.profile.education.map((education, index) => (
                    <div key={education.degree_name}>
                      <span
                        key={index}
                        className="block text-sm text-gray-600 font-semibold"
                      >{`${education.degree_name} in ${education.field_of_study} at ${education.school}`}</span>
                      <span className="block text-sm text-gray-500">
                        {education.starts_at?.day &&
                          `${education.starts_at.day}/${education.starts_at.month}/${education.starts_at.year} - `}

                        {education.ends_at?.day
                          ? `${education.ends_at.day}/${education.ends_at.month}/${education.ends_at.year}`
                          : "Present"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
