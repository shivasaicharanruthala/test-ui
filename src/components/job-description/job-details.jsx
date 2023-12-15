import * as React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import EmployeeForm from "./add-job";
// import styled components from Material UI
import { visuallyHidden } from "@mui/utils";
import Edit from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { tableCellClasses } from "@mui/material/TableCell";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {Box, Button, Table, TableBody, TableContainer, TableCell, TableHead, TableRow, TableSortLabel, Paper, Avatar,
  FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { deepOrange, deepPurple, lightBlue, amber, purple, teal, yellow, cyan, brown, blueGrey, lime, green } from "@mui/material/colors";

import "./job-details.scss";


const rows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

//Function written for Table Row components to style the rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

//Head cells have been initialized for the fields used in Job Table such as Job Title,Company Link and Job Type
const headCells = [
  {
    id: "JobTitle",
    label: "JOB TITLE",
  },
  {
    id: "Company",
    label: "COMPANY",
    minWidth: 100,
  },
  {
    id: "Job-Link",
    label: "JOB LINK",
    minWidth: 170,
    align: "right",
  },
  {
    id: "JobType",

    label: "JOB TYPE",
    minWidth: 170,
  },
  {
    id: "Actions",
    label: "ACTIONS",
  },
];

//Functionality starts from here which includes CRUD operation for table component and
export default function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const colorsList = [
    deepOrange[500],
    deepPurple[500],
    lightBlue[500],
    amber[500],
    purple[500],
    teal[500],
    yellow[500],
    cyan[500],
    brown[500],
    blueGrey[500],
    lime[500],
    green[500],
  ];

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = (type) => {
    if (type == "add") {
      setUpdateData({});
    }
    setIsModalOpen(!isModalOpen);
  };

  //Initialization ofthe states used for different purpose within the class
  const [updateData, setUpdateData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listingsFilter, setListingsFilter] = useState([]);
  const [listings, setListings] = useState([]);
  const [jobListingsLength, setJobListingsLength] = useState(0);
  const [companyFilter, setCompanyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const baseUri = `http://localhost:8080/job-listings`;

  //Backend functionalities for fetch data is called using Fetch API
  const fetchTableDetails = async () => {
    const response = await fetch(baseUri);
    const jsonData = await response.json((data) => data);
    console.log("the json data", jsonData);
    setTableData(jsonData);
    setListings(jsonData);
    setListingsFilter(jsonData);
    setJobListingsLength(jsonData.length);
  };
  //Used for the population of table elements while loading of page for previous job sections which have been inserted
  useEffect(() => {
    fetchTableDetails();
  }, [jobListingsLength]);

  //Function defined for Delete operation
  const handleDelete = async (id) => {
    console.log("the url", baseUri + id);
    const response = fetch(`${baseUri + "/" + id}`, {
      method: "DELETE",
    });
    if ((await response).json) {
      fetchTableDetails();
    }
  };

  //Used for Update functionality inside the Job table reflection
  const handleUpdate = async (data) => {
    console.log("data here: ", data);
    setUpdateData(data);
    handleModalOpen("edit");
  };

  //Used for Submit functionality inside the Job table
  const handleFilterSubmit = (e) => {
    e.preventDefault();

    console.log(companyFilter, typeFilter);
    if (companyFilter !== "" && typeFilter !== "") {
      setListingsFilter(
        listings
          .filter((data) => data.company === companyFilter)
          .filter((data) => data.jobType === typeFilter)
      );
    } else if (companyFilter !== "") {
      setListingsFilter(
        listings.filter((data) => data.company === companyFilter)
      );
    } else if (typeFilter !== "") {
      setListingsFilter(listings.filter((data) => data.jobType === typeFilter));
    } else {
      setListingsFilter(listings);
    }
  };

  //Function dor StyleTableRow is used for styling of the TableRow components
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:nth-of-type(even)": {
      paddingLeft: "45px",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
      paddingLeft: "48px",
    },
  }));

  //Function for StyleTableCell is used for style of the TableCell components
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#208094",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  // Statements for the rendering operations are started from this position which includes fetch details and cretae operations for the table
  return (
    <div>
      <EmployeeForm
        isModalOpen={isModalOpen}
        handleModal={handleModalOpen}
        fetchTableDetails={fetchTableDetails}
        updateData={updateData}
      />
      <div className="search-form">
        <FilterListIcon
          fontSize="medium"
          sx={{ marginTop: "22px", marginRight: "15px" }}
        />
        <form onSubmit={handleFilterSubmit}>
          <TextField
            id="standard-basic-table"
            label="Company"
            variant="standard"
            onChange={(e) => setCompanyFilter(e.target.value)}
          />
          {/* Job Type with Internship or Full Time has been added and the functions for the same is been listed */}
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Internship"}>Internship</MenuItem>
              <MenuItem value={"FullTime"}>FullTime</MenuItem>
            </Select>
          </FormControl>
          {/* Button for search implementation is added. This is to be mentioned as the filter search */}
          <Button
            type="submit"
            color="success"
            variant="contained"
            sx={{ marginTop: "10px", marginLeft: "15px" }}
            startIcon={<SearchIcon fontSize="small" />}
          >
            Search
          </Button>
        </form>

        {/* Button for add job openings which after opening will show thw modal */}

        <div className="add-job-listings-btn">
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: "10px", marginLeft: "295px" }}
            endIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={() => {
              handleModalOpen("add");
            }}
          >
            Add Job Openings
          </Button>
        </div>
      </div>
      {/* Table container starts from here which will return the value inside the table */}
      <div className="custom-table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <StyledTableRow>
                {headCells.map((headCell) => (
                  <StyledTableCell
                    key={headCell.id}
                    sx={{ backgroundColor: "#208094" }}
                  >
                    <TableSortLabel
                      // active={orderBy === headCell.id}
                      // direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                      className={"table-cell"}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {/* Implementation of StyledTableRow has been done here where the function is written above */}
              {listingsFilter.map((data, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{data.jobTitle}</StyledTableCell>
                  <StyledTableCell>
                    <div className="divCell">
                      {/* Avatar for Company has been included with colour changes with styled view on page opening */}
                      <Avatar
                        className="avatarAddition"
                        sx={{
                          height: 25,
                          width: 25,
                          bgcolor: colorsList[Math.ceil(Math.random() * 10)],
                        }}
                      >
                        {data.company.toString()[0]}
                      </Avatar>
                      <div style={{ marginTop: 5 }}>{data.company}</div>
                    </div>
                  </StyledTableCell>
                  {/* Implementation of StyledTableCell has been done here where the function is written above */}
                  <StyledTableCell>
                    <a
                      className="aHyperlink"
                      href={data.jobLink}
                      target="_blank"
                    >
                      Link
                    </a>
                  </StyledTableCell>
                  <StyledTableCell>{data.jobType}</StyledTableCell>
                  {/* Edit refers to data update upon any changes done on the table.Edit also refers to an edit icon in the front page */}
                  <StyledTableCell>
                    <Edit
                      color="primary"
                      fontSize="medium"
                      onClick={() => handleUpdate(data)}
                    />
                    {/* Delete refers to data deletion upon any changes done on the table.Delete also refers to an delete icon in the front page */}
                    <DeleteIcon
                      color="error"
                      fontSize="medium"
                      onClick={() => handleDelete(data.id)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
