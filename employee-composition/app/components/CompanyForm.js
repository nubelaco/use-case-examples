"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PieChart from "./Pie";

const CompanyForm = () => {
  const [companyUrl, setCompanyUrl] = useState("");

  const [countryData, setCountryData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of employees",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const [occupationData, setOccupationData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const handleSubmit = async () => {
    fetch(`/api/mockEmployeeListing?url=${companyUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        const countryCount = {};

        data.employees.forEach((employee) => {
          const country = employee.profile.country_full_name;
          countryCount[country] = (countryCount[country] || 0) + 1;
        });

        const occupationCount = {};

        data.employees.forEach((employee) => {
          const occupation = employee.profile.occupation;
          occupationCount[occupation] = (occupationCount[occupation] || 0) + 1;
        });

        console.log(occupationCount);

        setCountryData((prev) => ({
          labels: Object.keys(countryCount),
          datasets: [
            {
              label: "Employees",
              data: Object.values(countryCount),
              backgroundColor: Object.keys(countryCount).map(
                (_, index) =>
                  prev.datasets[0].backgroundColor[
                    index % prev.datasets[0].backgroundColor.length
                  ],
              ),
              borderColor: prev.datasets[0].borderColor,
              borderWidth: prev.datasets[0].borderWidth,
            },
          ],
        }));

        setOccupationData((prev) => ({
          labels: Object.keys(occupationCount),
          datasets: [
            {
              data: Object.values(occupationCount),
              backgroundColor: Object.keys(occupationCount).map(
                (_, index) =>
                  prev.datasets[0].backgroundColor[
                    index % prev.datasets[0].backgroundColor.length
                  ],
              ),
              borderColor: prev.datasets[0].borderColor,
              borderWidth: prev.datasets[0].borderWidth,
            },
          ],
        }));
      });
  };

  return (
    <div className="w-full">
      <div className="mb-12 flex gap-4 w-full">
        <Input
          className="w-96"
          placeholder="LinkedIn Company URL"
          value={companyUrl}
          onChange={(e) => setCompanyUrl(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <div className="flex gap-4 max-w-xl">
        {countryData.labels.length > 0 && (
          <PieChart data={countryData} />
        )}
        {occupationData.labels.length > 0 && (
          <PieChart data={occupationData} />
        )}
      </div>
    </div>
  );
};

export default CompanyForm;
