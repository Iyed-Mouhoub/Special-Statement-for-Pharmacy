import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Paper,
  Stack
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";

import { fr } from "date-fns/locale";

// Add these fields to your validation schema:
const schema = yup.object().shape({
  dateDOrdonance: yup
    .date()
    .max(new Date(), "La date ne peut pas être dans le futur")
    .required("Date obligatoire"),
  dateDeFacture: yup
    .date()
    .max(new Date(), "La date ne peut pas être dans le futur")
    .required("Date obligatoire"),
  date: yup
    .date()
    .max(new Date(), "La date ne peut pas être dans le futur")
    .required("Date obligatoire"),
  numeroDeBordereau: yup
    .string()
    .required("Numero de bordereau obligatoire"),
  codeCentre: yup
    .string()
    .required("Code centre obligatoire"),
  codePharmacien: yup
    .string()
    .required("Code pharmacien obligatoire"),
  nomPharmacien: yup
    .string()
    .required("Nom pharmacien obligatoire"),
  nombreTotalFactures: yup
    .number()
    .typeError("Nombre valide requis")
    .min(0)
    .required(),
  montantTotalBordereau: yup
    .number()
    .typeError("Nombre valide requis")
    .min(0)
    .required(),
  montantFormalites: yup
    .number()
    .typeError("Nombre valide requis")
    .min(0)
    .required(),
  montantTotalMajoration: yup
    .number()
    .typeError("Nombre valide requis")
    .min(0)
    .required(),
  montantGlobalBordereau: yup
    .number()
    .typeError("Nombre valide requis")
    .min(0)
    .required()
});

export default function Page1() {
  const navigate = useNavigate();
  function parseDate(val) {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    const dateObj = new Date(val);
    return isNaN(dateObj) ? new Date() : dateObj;
  }
  
  const savedPage1Data = sessionStorage.getItem("page1data");
  const defaultValues = savedPage1Data 
    ? (() => {
        const parsed = JSON.parse(savedPage1Data);
        return {
          ...parsed,
          dateDeFacture: parseDate(parsed.dateDeFacture),
          dateDOrdonance: parseDate(parsed.dateDOrdonance),
          date: parseDate(parsed.date),
        };
      })()
    : {
        dateDeFacture: new Date(),
        dateDOrdonance: new Date(),
        date: new Date(),
        codePharmacien: "1901018466",
        nomPharmacien: "MOUHOUB FARID",
        codeCentre: "11915",
        numeroDeBordereau: "",
      };
  


const {
  control,
  handleSubmit,
  watch,
  trigger,
  formState: { errors }
} = useForm({
  resolver: yupResolver(schema),
  defaultValues
});

const watchedValues = watch();

useEffect(() => {
  // Save current form data to sessionStorage on every form change
  sessionStorage.setItem("page1data", JSON.stringify(watchedValues));
}, [watchedValues]);


  const onSubmit = (data) => {
    sessionStorage.setItem("page1data", JSON.stringify(data));
    navigate("/table");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
      <Container maxWidth="md" component={Paper} sx={{ p: 4, mt: 4, mb: 4 }}>
        {/* Header */}
        <Grid container justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Grid item>
            <Typography variant="subtitle1" fontWeight="bold">
              M-T-E-S-S
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              CNAS
            </Typography>
          </Grid>
          <Grid item textAlign="right">
            <Typography variant="subtitle1" fontWeight="bold">
              Système CHIFA
            </Typography>
            <Stack spacing={2} mt={1}>
  {/* Date d'ordonance */}
  <Controller
  name="dateDOrdonance"
  control={control}
  render={({ field }) => (
    <DatePicker
      label="Date d'Ordonance"
      format="dd/MM/yyyy"
      value={field.value}
      onChange={(date) => {
        field.onChange(date);
        trigger(field.name);  // trigger validation immediately on change
      }}
      onBlur={field.onBlur}
      onError={() => {}}      // ensures MUI DatePicker correctly flags errors
      maxDate={new Date()}   // optionally restrict future dates in picker UI
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          error={!!errors.dateDOrdonance}
          helperText={errors.dateDOrdonance?.message || " "}
        />
      )}
    />
  )}
/>


  {/* Date de Facture */}
  <Controller
  name="dateDeFacture"
  control={control}
  render={({ field }) => (
    <DatePicker
      label="Date de Facture"
      format="dd/MM/yyyy"
      value={field.value}
      onChange={(date) => {
        field.onChange(date);
        trigger(field.name);
      }}
      onBlur={field.onBlur}
      onError={() => {}}
      maxDate={new Date()}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          error={!!errors.dateDeFacture}
          helperText={errors.dateDeFacture?.message || " "}
        />
      )}
    />
  )}
/>


  {/* Date */}
  <Controller
  name="date"
  control={control}
  render={({ field }) => (
    <DatePicker
      label="Date"
      format="dd/MM/yyyy"
      value={field.value}
      onChange={(date) => {
        field.onChange(date);
        trigger(field.name);
      }}
      onBlur={field.onBlur}
      onError={() => {}}
      maxDate={new Date()}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          error={!!errors.date}
          helperText={errors.date?.message || " "}
        />
      )}
    />
  )}
/>

</Stack>
          </Grid>
        </Grid>

        {/* Section Title */}
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Bordereau Special
        </Typography>

        {/* Info Fields */}
<Grid container spacing={3} mb={4}>
  <Grid item xs={6}>
    <Controller
      name="codeCentre"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Code Centre"
          fullWidth
          size="small"
          error={!!errors.codeCentre}
          helperText={errors.codeCentre?.message}
        />
      )}
    />
  </Grid>
  <Grid item xs={6}>
    <Controller
      name="codePharmacien"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Code Pharmacien"
          fullWidth
          size="small"
          error={!!errors.codePharmacien}
          helperText={errors.codePharmacien?.message}
        />
      )}
    />
  </Grid>
  
  <Grid item xs={12}>
  <Controller
    name="nomPharmacien"
    control={control}
    defaultValue="MOUHOUB FARID"
    render={({ field }) => (
      <TextField
        {...field}
        label="Nom Pharmacien"
        fullWidth
        size="small"
      />
    )}
  />
</Grid>

  
  <Grid item xs={6}>
    <Controller
      name="numeroDeBordereau"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Numéro Bordereau"
          fullWidth
          size="small"
          error={!!errors.numeroDeBordereau}
          helperText={errors.numeroDeBordereau?.message}
        />
      )}
    />
  </Grid>
  <Grid item xs={6}>
    <Controller
      name="nombreTotalFactures"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Nombre de Facture"
          fullWidth
          size="small"
          error={!!errors.nombreTotalFactures}
          helperText={errors.nombreTotalFactures?.message}
        />
      )}
    />
  </Grid>
  
  <Grid item xs={6}>
    <Controller
      name="montantTotalBordereau"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Montant Total Bordereau"
          fullWidth
          size="small"
          error={!!errors.montantTotalBordereau}
          helperText={errors.montantTotalBordereau?.message}
        />
      )}
    />
  </Grid>
  <Grid item xs={6}>
    <Controller
      name="montantFormalites"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Montant Formalités Administratives et Électroniques"
          fullWidth
          size="small"
          error={!!errors.montantFormalites}
          helperText={errors.montantFormalites?.message}
        />
      )}
    />
  </Grid>
  <Grid item xs={6}>
    <Controller
      name="montantTotalMajoration"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Montant Total Majoration"
          fullWidth
          size="small"
          error={!!errors.montantTotalMajoration}
          helperText={errors.montantTotalMajoration?.message}
        />
      )}
    />
  </Grid>
  <Grid item xs={6}>
    <Controller
      name="montantGlobalBordereau"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Montant global du bordereau"
          fullWidth
          size="small"
          error={!!errors.montantGlobalBordereau}
          helperText={errors.montantGlobalBordereau?.message}
        />
      )}
    />
  </Grid>
</Grid>

        {/* Submit button */}
        <Box textAlign="right">
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Continuer vers la table des factures
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
