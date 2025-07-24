import React, { version } from "react";
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

// Validation schema
const schema = yup.object().shape({
  listeNoire: yup
  .date()
  .max(new Date(new Date().setHours(23, 59, 59, 999)), "La date ne peut pas être dans le futur")
  .required("Date obligatoire"),
  medicaments: yup
  .date()
  .max(new Date(new Date().setHours(23, 59, 59, 999)), "La date ne peut pas être dans le futur")
  .required("Date obligatoire"),
  date: yup
  .date()
  .max(new Date(new Date().setHours(23, 59, 59, 999)), "La date ne peut pas être dans le futur")
  .required("Date obligatoire"),
  version: yup
    .string()
    .required("Version obligatoire"),
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
  // Replace all the numeric field validations with:
nombreTotalFactures: yup
.number()
.transform((val, originalVal) => originalVal === "" ? undefined : val)
.typeError("Nombre valide requis")
.min(0, "La valeur doit être positive")
.required("Champ obligatoire"),

montantTotalBordereau: yup
.number()
.transform((val, originalVal) => originalVal === "" ? undefined : val)
.typeError("Nombre valide requis")
.min(0, "La valeur doit être positive")
.required("Champ obligatoire"),

montantFormalites: yup
.number()
.transform((val, originalVal) => originalVal === "" ? undefined : val)
.typeError("Nombre valide requis")
.min(0, "La valeur doit être positive")
.required("Champ obligatoire"),

montantTotalMajoration: yup
.number()
.transform((val, originalVal) => originalVal === "" ? undefined : val)
.typeError("Nombre valide requis")
.min(0, "La valeur doit être positive")
.required("Champ obligatoire"),

montantGlobalBordereau: yup
.number()
.transform((val, originalVal) => originalVal === "" ? undefined : val)
.typeError("Nombre valide requis")
.min(0, "La valeur doit être positive")
.required("Champ obligatoire")
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
          medicaments: parseDate(parsed.medicaments),
          listeNoire: parseDate(parsed.listeNoire),
          date: parseDate(parsed.date),
        };
      })()
    : {
        medicaments: new Date(),
        listeNoire: new Date(),
        date:new Date(),
        version: "",
        codePharmacien: "1901018466",
        nomPharmacien: "MOUHOUB FARID",
        codeCentre: "11915",
        numeroDeBordereau: "",
        nombreTotalFactures: "",
        montantTotalBordereau: "",
        montantFormalites: "",
        montantTotalMajoration: "",
        montantGlobalBordereau: ""
      };

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange' // This enables real-time validation
  });

  const watchedValues = watch();

  useEffect(() => {
    // Save current form data to sessionStorage on every form change
    sessionStorage.setItem("page1data", JSON.stringify(watchedValues));
  }, [watchedValues]);

  const onSubmit = async (data) => {
    // Trigger validation on all fields before submitting
    const isFormValid = await trigger();
    
    if (isFormValid) {
      sessionStorage.setItem("page1data", JSON.stringify(data));
      navigate("/table");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
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

              {/* Version */}

              <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Version"
                  fullWidth
                  size="small"
                  error={!!errors.version}
                  helperText={errors.version?.message}
                />
              )}
            />
              {/* Liste Noire */}
              <Controller
                name="listeNoire"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Liste Noire"
                    format="dd/MM/yyyy"
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      trigger(field.name);
                    }}
                    maxDate={new Date(new Date().setHours(23, 59, 59, 999))}
                    slotProps={{
                      textField: {
                        size: "small",
                        error: !!errors.listeNoire,
                        helperText: errors.listeNoire?.message || " ",
                        onBlur: field.onBlur
                      }
                    }}
                  />
                )}
              />

              {/* Médicaments */}
              <Controller
                name="medicaments"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Médicaments"
                    format="dd/MM/yyyy"
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      trigger(field.name);
                    }}
                    maxDate={new Date(new Date().setHours(23, 59, 59, 999))}
                    slotProps={{
                      textField: {
                        size: "small",
                        error: !!errors.medicaments,
                        helperText: errors.medicaments?.message || " ",
                        onBlur: field.onBlur
                    }
                    }}
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
                    maxDate={new Date(new Date().setHours(23, 59, 59, 999))}
                    slotProps={{
                      textField: {
                        size: "small",
                        error: !!errors.date,
                        helperText: errors.date?.message || " ",
                        onBlur: field.onBlur
                      }
                    }}
                  />
                )}
              />
            </Stack>
          </Grid>
        </Grid>

        {/* Section Title */}
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          Bordereau Spécial
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
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom Pharmacien"
                  fullWidth
                  size="small"
                  error={!!errors.nomPharmacien}
                  helperText={errors.nomPharmacien?.message}
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
                  type="number"
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
                  type="number"
                  step="0.01"
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
                  type="number"
                  step="0.01"
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
                  type="number"
                  step="0.01"
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
                  type="number"
                  step="0.01"
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
          <Button 
            variant="contained" 
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            Continuer vers la table des factures
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
