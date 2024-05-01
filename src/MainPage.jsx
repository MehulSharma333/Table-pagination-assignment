import React, { useState, useEffect } from "react";
import { Table, Select, Tag, Input, message } from "antd";

const { Option } = Select;

const MainComponent = () => {
  const savedSelectedTags = localStorage.getItem("selectedTags")
    ? JSON.parse(localStorage.getItem("selectedTags"))
    : [];
  const savedSearchQuery = localStorage.getItem("searchQuery") || "";
  const savedPage = parseInt(localStorage.getItem("currentPage")) || 1;

  const [columns, setColumns] = useState([
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "body",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      filters: [],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
      render: (tags) => (
        <>
          {tags.map((tag, index) => (
            <Tag key={index} color="blue">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
  ]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedTags, setSelectedTags] = useState(savedSelectedTags);
  const [searchQuery, setSearchQuery] = useState(savedSearchQuery);
  const [currentPage, setCurrentPage] = useState(savedPage);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      fetch("https://dummyjson.com/posts")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
          return res.json();
        })
        .then((result) => {
          setDataSource(result.posts);
          const allTags = result.posts.reduce((acc, post) => {
            post.tags.forEach((tag) => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
            return acc;
          }, []);
          setColumns(
            columns.map((col) => {
              if (col.dataIndex === "tags") {
                return {
                  ...col,
                  filters: allTags.map((tag) => ({ text: tag, value: tag })),
                };
              }
              return col;
            })
          );
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } catch (error) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("currentPage", currentPage);
    const filteredData = dataSource.filter(
      (record) =>
        selectedTags.every((tag) => record.tags.includes(tag)) &&
        record.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredData);
  }, [selectedTags, searchQuery, currentPage, dataSource]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div>
        {" "}
        <h1 className="text-4xl text-center">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="lg:w-3/4 lg:h-3/4 mx-auto p-4">
      <div className="flex flex-col lg:flex-row lg:gap-4 lg:mt-10">
        <Select
          mode="multiple"
          style={{ flex: "1", marginBottom: "10px" }}
          placeholder="Select tags"
          onChange={setSelectedTags}
          value={selectedTags}
          className="lg:h-[40px]"
        >
          {columns[3].filters.map((filter) => (
            <Option key={filter.value} value={filter.value}>
              {filter.text}
            </Option>
          ))}
        </Select>
        <Input
          id="searchByName"
          style={{ flex: "1" }}
          placeholder="Enter The Description"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          className="lg:h-[40px]"
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData.slice((currentPage - 1) * 5, currentPage * 5)}
        pagination={{
          pageSize: 5,
          current: currentPage,
          onChange: handlePageChange,
          total: filteredData.length,
        }}
      />
    </div>
  );
};

export default MainComponent;
