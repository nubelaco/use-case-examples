import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import mockPeopleData from "@/app/person_search_mock.json";
import { IoLocationOutline, IoLocationSharp } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "./Loader";
import { FaArrowLeft } from "react-icons/fa";
import AutoComplete from "./AutoComplete";
import countryISO from "@/lib/countryISO.json";
import { IoMdBriefcase } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";

const PeopleFilter = ({
  selectedPeople,
  setSelectedPeople,
  isRecentSearchesOpen,
  setRecentSearchesOpen,
  setRecentSearches,
}) => {
  const [peopleData, setPeopleData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [error, setError] = useState([]);
  const [payload, setPayload] = useState({
    country: "",
    current_role_title: "",
    current_company_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveRecentSearches = (searches) => {
    const existingSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    existingSearches.push({
      country: payload.country,
      current_role_title: payload.current_role_title,
      current_company_name: payload.current_company_name,
      results: searches,
    });

    if (existingSearches.length > 10) {
      existingSearches.shift();
    }

    localStorage.setItem("recentSearches", JSON.stringify(existingSearches));
  };

  const handleSearch = async () => {
    setError([]);
    setRecentSearchesOpen(false);
    let hasError = false;

    if (payload.country === "") {
      setError((prev) => [...prev, "Country is required"]);
      hasError = true;
    }
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      setError((prev) => [
        ...prev,
        "Please enter your API key in the settings",
      ]);
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        country: countryISO.find(country => country.label=== payload.country).value,
        page_size: 10,
        enrich_profiles: "enrich",
    });

    // Conditionally add parameters if they are not empty
    if (payload.current_role_title) {
        params.append("current_role_title", payload.current_role_title);
    }
    if (payload.current_company_name) {
        params.append("current_company_name", payload.current_company_name);
    }


      await fetch(
        `/api/mockPeople?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setPeopleData(data.results);
          handleSaveRecentSearches(data.results);
        });
    } catch (error) {
      console.log(error, "error");
    }
    setIsLoading(false);
  };

  const handleViewDetails = (person) => {
    setViewDetails(person);
    setIsModalOpen(true);
  };

  const handleViewRecentSearch = (search) => {
    setPeopleData(search);
    setRecentSearchesOpen(false);
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/4 bg-white rounded-lg p-4">
        {/* Sidebar for filters */}
        <h3 className="font-bold">Filters</h3>

        <Accordion type="single" collapsible>
          <AccordionItem value="country">
            <AccordionTrigger className="flex justify-start gap-2">
              <IoLocationSharp
                style={{ transform: "rotate(0deg)" }}
                className="h-5 w-5  text-blue-600 inline-block"
              />
              <span className="text-lg font-bold">Location</span>
            </AccordionTrigger>
            <AccordionContent>
              <AutoComplete
                options={countryISO}
                setSelectedOption={(option) =>
                  setPayload({ ...payload, country: option })
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="current-role">
            <AccordionTrigger className="flex justify-start gap-2">
              <IoMdBriefcase
                style={{ transform: "rotate(0deg)" }}
                className="h-5 w-5  text-blue-600 inline-block"
              />
              <span className="text-lg font-bold">Job Title</span>
            </AccordionTrigger>
            <AccordionContent>
              <Input
                type="text"
                placeholder="Software Engineer"
                className="border border-gray-300 rounded-md p-2"
                value={payload.current_role_title}
                onChange={(e) =>
                  setPayload({ ...payload, current_role_title: e.target.value })
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="current-company">
            <AccordionTrigger className="flex justify-start gap-2">
              <FaBuilding
                style={{ transform: "rotate(0deg)" }}
                className="h-5 w-5  text-blue-600 inline-block"
              />
              <span className="text-lg font-bold">Current Company</span>
            </AccordionTrigger>
            <AccordionContent>
              <Input
                type="text"
                placeholder="Current Company"
                className="border border-gray-300 rounded-md p-2"
                value={payload.current_company_name}
                onChange={(e) =>
                  setPayload({ ...payload, current_company_name: e.target.value })
                }
              />
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              className="w-full mt-4 bg-blue-600 text-white text-md font-semibold"
            >
              Apply
            </Button>
          </div>

          {error &&
            error.map((err) => (
              <p
                className="text-red-500 text-sm font-semibold text-center mt-2"
                key={err}
              >
                {err}
              </p>
            ))}
        </Accordion>
      </div>
      <div className="w-3/4 bg-white rounded-lg p-4">
        <div>
          {isRecentSearchesOpen && (
            <div>
              <span className="flex flex-col items-center gap-4 w-full justify-center mt-12">
                <span className="text-3xl font-semibold">Recent Searches</span>
                <div className="flex flex-col gap-4">
                  {JSON.parse(localStorage.getItem("recentSearches")).map(
                    (search) => (
                      <div
                        key={search.id}
                        className="border-2 border-gray-200 p-4 rounded-md w-[400px] hover:cursor-pointer"
                        onClick={() => handleViewRecentSearch(search.results)}
                      >
                        <span>{search.country}</span>
                        <span>{` ${
                          search.current_role_title && ", " + search.current_role_title
                        }`}</span>
                        <span>{`${
                          search.current_company_name &&
                          ", " + search.current_company_name
                        }`}</span>
                      </div>
                    ),
                  )}
                </div>
              </span>
            </div>
          )}

          {!isRecentSearchesOpen && !isLoading && peopleData.length === 0 && (
            <div>
              <span className="flex items-center gap-4 w-full justify-center mt-24">
                <FaArrowLeft className="text-5xl" />
                <span className="text-3xl font-semibold">
                  Find your prospects here
                </span>
              </span>
            </div>
          )}

          {!isRecentSearchesOpen && isLoading ? (
            <Loader />
          ) : (
            !isRecentSearchesOpen &&
            peopleData.map((person) => (
              <div
                key={person.profile.public_identifier}
                className="flex border-b-2 border-gray-200 py-4"
              >
                <Checkbox
                  className="mr-6 self-center"
                  checked={selectedPeople.includes(person)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPeople([...selectedPeople, person]);
                    } else {
                      setSelectedPeople(
                        selectedPeople.filter(
                          (p) =>
                            p.profile.public_identifier !==
                            person.profile.public_identifier,
                        ),
                      );
                    }
                  }}
                />
                <div className="flex flex-col border-r-2 border-gray-200 w-[400px] truncate pr-4">
                  <div className="flex items-center gap-2 flex-0">
                    <a
                      className="text-black block text-md font-semibold"
                      href={person.linkedin_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {person.profile.full_name}
                    </a>
                    <FaLinkedin className="text-blue-600" />
                  </div>
                  <p className="text-sm">
                    {person.profile.experiences[0].title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <IoLocationSharp className="text-gray-500" />
                    <span className="text-gray-500 text-sm">{`${person.profile.city}, ${person.profile.state}, ${person.profile.country}`}</span>
                  </div>
                </div>

                <div className="w-[300px] truncate px-4">
                  {person.profile.experiences[0]
                    .company_linkedin_profile_url ? (
                    <Link
                      href={
                        person.profile.experiences[0]
                          .company_linkedin_profile_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-blue-600 text-sm font-semibold">
                        {person.profile.experiences[0].company}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold">
                      {person.profile.experiences[0].company}
                    </span>
                  )}

                  {person.profile.experiences[0].location ? (
                    <span className="block text-sm text-gray-500 ">
                      {person.profile.experiences[0].location}
                    </span>
                  ) : null}
                </div>

                <div className="ml-auto">
                  <button
                    onClick={() => handleViewDetails(person)}
                    className="border-2 border-blue-600 bg-white text-blue-600 px-4 py-2 rounded-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        viewDetails={viewDetails}
      />
    </div>
  );
};

export default PeopleFilter;
