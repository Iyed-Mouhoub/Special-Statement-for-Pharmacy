import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Box, IconButton, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { fr } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";




// React-PDF imports
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Custom styles for wider input fields
const tableInputStyles = {
  '& .MuiInputBase-input': {
    minWidth: '100px', // Minimum width for input fields
    width: '100px',
  }
};

const tableCellStyles = {
  padding: '12px', // Increased padding from default
  minWidth: '100px', // Minimum width for each cell
  width: '100px',
};


// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  section: {
    margin: 5,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    width: 150,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#2980b9',
    color: 'white'
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 9,
    fontWeight: 'bold'
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 8
  }
});

// Helper function to format date safely
const formatDate = (dateValue) => {
  if (!dateValue) return "";
  try {
    const date = new Date(dateValue);
    return date.toLocaleDateString('fr-FR');
  } catch (e) {
    return "";
  }
};

// Helper function to format numeric values safely
const formatNumericValue = (value) => {
  if (value === undefined || value === null || value === "") return "0";
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? "0" : parsed.toString();
  }
  return "0";
};

// PDF Document Component
const BordereauPDF = ({ formData, rows }) => (
  <Document>
    {/* Page 1: Header Information */}
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.section}>
        <Text style={[pdfStyles.header, { fontSize: 18, textAlign: 'center' }]}>M-T-E-S-S</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5 }}>CNAS</Text>
        <Text style={{ fontSize: 12, textAlign: 'right' }}>Système CHIFA</Text>
        
        <View style={{ marginTop: 20 }}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Date d'Ordonnance:</Text>
            <Text style={pdfStyles.value}>{formatDate(formData.dateDOrdonance)}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Date de Facture:</Text>
            <Text style={pdfStyles.value}>{formatDate(formData.dateDeFacture)}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Date:</Text>
            <Text style={pdfStyles.value}>{formatDate(formData.date)}</Text>
          </View>
        </View>

        <Text style={[pdfStyles.header, { fontSize: 20, textAlign: 'center', marginTop: 20, marginBottom: 20 }]}>Bordereau Special</Text>
        
        <View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Code Centre:</Text>
            <Text style={pdfStyles.value}>{formData.codeCentre || ""}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Code Pharmacien:</Text>
            <Text style={pdfStyles.value}>{formData.codePharmacien || ""}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Nom Pharmacien:</Text>
            <Text style={pdfStyles.value}>{formData.nomPharmacien || ""}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Numéro Bordereau:</Text>
            <Text style={pdfStyles.value}>{formData.numeroDeBordereau || ""}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Nombre de Facture:</Text>
            <Text style={pdfStyles.value}>{formatNumericValue(formData.nombreTotalFactures)}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Montant Total Bordereau:</Text>
            <Text style={pdfStyles.value}>{formatNumericValue(formData.montantTotalBordereau)}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Montant Formalités Admin:</Text>
            <Text style={pdfStyles.value}>{formatNumericValue(formData.montantFormalites)}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Montant Total Majoration:</Text>
            <Text style={pdfStyles.value}>{formatNumericValue(formData.montantTotalMajoration)}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Montant Global Bordereau:</Text>
            <Text style={pdfStyles.value}>{formatNumericValue(formData.montantGlobalBordereau)}</Text>
          </View>
        </View>
      </View>
    </Page>

    {/* Page 2: Table */}
    <Page size="A4" style={pdfStyles.page}>
      <Text style={[pdfStyles.header, { fontSize: 16, textAlign: 'center', marginBottom: 20 }]}>Table des Factures</Text>
      
      <View style={pdfStyles.table}>
        {/* Table Header */}
        <View style={pdfStyles.tableRow}>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>N° Assuré</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>N° Facture</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>Date Facture</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>Major*</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>Mt Assuré</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>Mt Officine</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>Mt Major**</Text>
          </View>
          <View style={pdfStyles.tableColHeader}>
            <Text style={pdfStyles.tableCellHeader}>Mt Global</Text>
          </View>
        </View>

        {/* Table Rows */}
        {rows.map((row, index) => (
          <View style={pdfStyles.tableRow} key={index}>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.nAssure}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.nFacture}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{formatDate(row.dateFacture)}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.major}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.mtAssure}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.mtOfficine}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.mtMajor}</Text>
            </View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>{row.mtGlobal}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const emptyRow = {
  nAssure: "",
  nFacture: "",
  dateFacture: "",
  major: "",
  mtAssure: "",
  mtOfficine: "",
  mtMajor: "",
  mtGlobal: "",
};

export default function Page2() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(() => {
    const savedRows = sessionStorage.getItem("bordereauTableRows");
    if (savedRows) {
      try {
        return JSON.parse(savedRows);
      } catch (e) {
        console.error("Error parsing saved rows:", e);
        return [{ ...emptyRow }];
      }
    }
    return [{ ...emptyRow }];
  });
  
  const [errors, setErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // Load data from Page1 and Page2 on component mount
useEffect(() => {
  // Load Page1 data
  const page1Data = sessionStorage.getItem("page1data");
  if (page1Data) {
    try {
      const parsedData = JSON.parse(page1Data);
      setFormData(parsedData);
      console.log("Loaded form data:", parsedData);
    } catch (e) {
      console.error("Error parsing page1 data:", e);
      setValidationMessage("Erreur lors du chargement des données de la page 1");
    }
  } else {
    setValidationMessage("Aucune donnée trouvée de la page 1. Veuillez retourner à la page 1.");
  }

  // Load saved rows data
  const savedRows = sessionStorage.getItem("bordereauTableRows");
  if (savedRows) {
    try {
      const parsedRows = JSON.parse(savedRows);
      setRows(parsedRows);
      console.log("Loaded saved rows:", parsedRows);
    } catch (e) {
      console.error("Erreur lors du chargement des lignes sauvegardées:", e);
    }
  }
}, []); // Empty dependency array - runs only on mount

// Save rows data whenever rows change
useEffect(() => {
  sessionStorage.setItem("bordereauTableRows", JSON.stringify(rows));
  console.log("Saved rows to sessionStorage:", rows);
}, [rows]);



 // Handle input change WITHOUT real-time validation
const handleChange = (index, field, value) => {
  const newRows = [...rows];
  newRows[index][field] = value;
  setRows(newRows);

  // Clear validation message when user starts typing (but no field validation)
  if (validationMessage) {
    setValidationMessage("");
  }
  
  // Optional: Add immediate feedback for debugging
  console.log(`Updated ${field} for row ${index}:`, value);
};


  // Add row
  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
    setErrors([...errors, {}]);
  };

  // Delete row

const deleteRow = (index) => {
  try {
    // Validate index
    if (index < 0 || index >= rows.length) {
      console.error("Invalid row index:", index);
      return;
    }
    
    // Filter out the row at the specified index
    const newRows = rows.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    
    // Ensure at least one row remains
    if (newRows.length === 0) {
      setRows([{ ...emptyRow }]);
      setErrors([{}]);
    } else {
      setRows(newRows);
      setErrors(newErrors);
    }
    
    // Clear validation message if it exists
    if (validationMessage) {
      setValidationMessage("");
    }
  } catch (error) {
    console.error("Error deleting row:", error);
    setValidationMessage("Erreur lors de la suppression de la ligne");
  }
};



  // Replace your validateRowForSubmission function with this corrected version:

const validateRowForSubmission = (row, index) => {
  const rowErrors = {};
  
  // N° Assuré validation
  if (!row.nAssure || row.nAssure.trim() === "") {
    rowErrors.nAssure = "Champ obligatoire";
  } else if (!/^\d+$/.test(row.nAssure.trim())) {
    rowErrors.nAssure = "Format invalide";
  }

  // N° Facture validation
  if (!row.nFacture || row.nFacture.trim() === "") {
    rowErrors.nFacture = "Champ obligatoire";
  }

  // Date Facture validation
  if (!row.dateFacture) {
    rowErrors.dateFacture = "Champ obligatoire";
  } else {
    const selectedDate = new Date(row.dateFacture);
    const today = new Date();
    if (selectedDate > today) {
      rowErrors.dateFacture = "La date ne peut pas être dans le futur";
    }
  }

  // Major validation - NOW REQUIRED
  if (!row.major || row.major.trim() === "") {
    rowErrors.major = "Champ obligatoire";
  } else if (!/^\d*\.?\d*$/.test(row.major.trim())) {
    rowErrors.major = "Format invalide";
  } else {
    const numValue = parseFloat(row.major.trim());
    if (isNaN(numValue)) {
      rowErrors.major = "Format invalide";
    } else if (numValue < 0) {
      rowErrors.major = "Format invalide";
    }
  }

  // Helper function for montant validation with CORRECTED logic
  const validateMontant = (value) => {
    // Check if empty first
    if (!value || value.trim() === "") {
      return "Champ obligatoire";
    }
    
    // If not empty, check if it's a valid number
    const numValue = parseFloat(value.trim());
    if (isNaN(numValue)) {
      return "Format invalide";
    }
    
    // Check for negative numbers
    if (numValue < 0) {
      return "Format invalide";
    }
    
    return null;
  };

  // Apply montant validations
  const mtAssureError = validateMontant(row.mtAssure);
  if (mtAssureError) rowErrors.mtAssure = mtAssureError;

  const mtOfficineError = validateMontant(row.mtOfficine);
  if (mtOfficineError) rowErrors.mtOfficine = mtOfficineError;

  const mtMajorError = validateMontant(row.mtMajor);
  if (mtMajorError) rowErrors.mtMajor = mtMajorError;

  const mtGlobalError = validateMontant(row.mtGlobal);
  if (mtGlobalError) rowErrors.mtGlobal = mtGlobalError;

  return rowErrors;
};

  // Validate all rows for submission
  const validateAllRowsForSubmission = () => {
    const newErrors = [];
    let hasErrors = false;

    rows.forEach((row, index) => {
      const rowErrors = validateRowForSubmission(row, index);
      newErrors[index] = rowErrors;
      if (Object.keys(rowErrors).length > 0) {
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };


  // Handle PDF generation with validation
  const handlePDFGeneration = () => {
    if (!validateAllRowsForSubmission()) {
      setValidationMessage("Veuillez corriger les erreurs avant d'exporter le PDF");
      return false;
    }
    
    if (Object.keys(formData).length === 0) {
      setValidationMessage("Données de la page 1 manquantes. Veuillez retourner à la page 1.");
      return false;
    }
    
    setValidationMessage(""); // Clear any previous validation messages
    return true;
  };

  // State to control PDF generation
  const [canGeneratePDF, setCanGeneratePDF] = useState(false);

  // Function to validate and enable PDF generation
  const validateForPDF = () => {
    const isValid = validateAllRowsForSubmission() && Object.keys(formData).length > 0;
    setCanGeneratePDF(isValid);
    if (!isValid) {
      if (Object.keys(formData).length === 0) {
        setValidationMessage("Données de la page 1 manquantes. Veuillez retourner à la page 1.");
      } else {
        setValidationMessage("Veuillez corriger les erreurs avant d'exporter le PDF");
      }
    } else {
      setValidationMessage("");
    }
    return isValid;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
    <Container maxWidth="xl" sx={{ my: 4, px: 2 }}>

      <Typography variant="h5" fontWeight="bold" mb={2}>Table des factures</Typography>
      
      {validationMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationMessage}
        </Alert>
      )}

      {/* Debug info - remove in production */}
      {Object.keys(formData).length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <div>Données de la page 1 chargées:</div>
          <div>Code Centre: {formData.codeCentre}</div>
          <div>Nom Pharmacien: {formData.nomPharmacien} </div> 
          <div>Code Pharmacien: {formData.codePharmacien}</div>
          <div>Numéro Bordereau: {formData.numeroDeBordereau}</div>
          <div>Nombre Total Factures: {formData.nombreTotalFactures}</div>
          <div>Montant Total Bordereau: {formData.montantTotalBordereau}</div>
          <div>Montant Formalités: {formData.montantFormalites}</div>
          <div>Montant Total Majoration: {formData.montantTotalMajoration}</div>
          <div>Montant Global Bordereau: {formData.montantGlobalBordereau}</div>
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>N° Assuré</TableCell>
              <TableCell>N° Facture</TableCell>
              <TableCell>Date Facture</TableCell>
              <TableCell>Major*</TableCell>
              <TableCell>Mt Assuré</TableCell>
              <TableCell>Mt Officine</TableCell>
              <TableCell>Mt Major**</TableCell>
              <TableCell>Mt Global</TableCell>
              <TableCell>Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={tableCellStyles}>
                  <TextField 
                    size="small" 
                    value={row.nAssure} 
                    onChange={e => handleChange(i, "nAssure", e.target.value)}
                    error={!!errors[i]?.nAssure}
                    helperText={errors[i]?.nAssure || " "} // Always reserve space for helper text
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                    sx={tableInputStyles}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  <TextField 
                    size="small" 
                    value={row.nFacture} 
                    onChange={e => handleChange(i, "nFacture", e.target.value)}
                    error={!!errors[i]?.nFacture}
                    helperText={errors[i]?.nFacture || " "}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                    sx={tableInputStyles}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>
  <DatePicker
    value={row.dateFacture ? new Date(row.dateFacture) : null}
    onChange={(newValue) => {
      const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
      handleChange(i, "dateFacture", dateString);
    }}
    format="dd/MM/yyyy"
    slotProps={{
      textField: {
        size: "small",
        error: !!errors[i]?.dateFacture,
        helperText: errors[i]?.dateFacture || " ",
        FormHelperTextProps: { sx: { minHeight: '20px' } },
        sx: tableInputStyles
      }
    }}
  />
</TableCell>
                <TableCell sx={tableCellStyles}>
                  <TextField 
                    size="small" 
                    value={row.major} 
                    onChange={e => handleChange(i, "major", e.target.value)}
                    error={!!errors[i]?.major}
                    helperText={errors[i]?.major || " "}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  <TextField 
                    type="number" 
                    size="small" 
                    value={row.mtAssure} 
                    onChange={e => handleChange(i, "mtAssure", e.target.value)}
                    error={!!errors[i]?.mtAssure}
                    helperText={errors[i]?.mtAssure || " "}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                    sx={tableInputStyles}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  <TextField 
                    type="number" 
                    size="small" 
                    value={row.mtOfficine} 
                    onChange={e => handleChange(i, "mtOfficine", e.target.value)}
                    error={!!errors[i]?.mtOfficine}
                    helperText={errors[i]?.mtOfficine || " "}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                    sx={tableInputStyles}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  <TextField 
                    type="number" 
                    size="small" 
                    value={row.mtMajor} 
                    onChange={e => handleChange(i, "mtMajor", e.target.value)}
                    error={!!errors[i]?.mtMajor}
                    helperText={errors[i]?.mtMajor || " "}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                    sx={tableInputStyles}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  <TextField
                    type="number"
                    value={row.mtGlobal}
                    onChange={e => handleChange(i, "mtGlobal", e.target.value)}
                    size="small"
                    error={!!errors[i]?.mtGlobal}
                    helperText={errors[i]?.mtGlobal || " "}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                    sx={tableInputStyles}
                  />
                </TableCell>    
                <TableCell>
  <IconButton 
    onClick={() => deleteRow(i)}
    color="error"
    size="small"
    aria-label={`Supprimer la ligne ${i + 1}`}
  >
    <DeleteIcon />
  </IconButton>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addRow}>
          Ajouter ligne
        </Button>
        
        {/* PDF Generation Button with Validation */}
        <PDFDownloadLink
  key={`pdf-${rows.length}-${JSON.stringify(rows)}`} // Force re-mount on data changes
  document={<BordereauPDF formData={formData} rows={rows} />}
  fileName="bordereau.pdf"
  style={{ textDecoration: 'none' }}
>
  {({ blob, url, loading, error }) => (
    <Button
      variant="contained"
      color="primary"
      disabled={loading}
      onClick={(e) => {
        if (!validateForPDF()) {
          e.preventDefault();
          return false;
        }
      }}
    >
      {loading ? 'Génération PDF...' : 'Exporter PDF/Imprimer'}
    </Button>
  )}
</PDFDownloadLink>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Retour page 1
        </Button>
      </Box>
    </Container>
    </LocalizationProvider>
  );
}