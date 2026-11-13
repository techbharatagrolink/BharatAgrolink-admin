"use client";

import { DataTable, download, toCsv } from "@/components/data-table/data-table";
import { useToast } from "@/components/ui/toast";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Select } from "@/components/ui/form";
import { exportGeoAction } from "@/lib/actions/admin/parity/geo";
import { UrlInput } from "@/components/admin/parity/crm/url-input";

const long = (key, label, width = 320) => ({ key, label, wrap: true, width });
const PROFILE = [
  long("soil", "Soil"),
  long("water", "Water", 220),
  long("wind", "Wind", 220),
  long("climate", "Climate", 180),
  long("weather", "Weather", 260),
  long("cropSeason", "Crop season", 140),
  long("crops", "Crops"),
  long("cropDiseases", "Crop diseases"),
];

/*
 * The profile columns are long sentences, parts joined by " · ". The table shows the short form; the database and
 * Export keep the full text. Anything that does not match the expected shape is shown unchanged.
 */
const parts = (v) => v.split(" · ").map((s) => s.trim()).filter(Boolean);
const noTags = (v) => v.replace(/\s*\[[^\]]*\]/g, "").replace(/\s*\((?:live|state-level)[^)]*\)/gi, "").trim();
const SHORT = {
  // "Alluvial soil (likely) · Clay loam: ... [SoilGrids 0-5cm]" -> without the [source] / estimate tags
  soil: (v) => noTags(v),
  // "Moderate water · ~1119 mm rain/yr, wettest Sep, ..." -> "Moderate water · ~1119 mm rain/yr"
  water: (v) => {
    const [level, rain] = parts(noTags(v));
    return rain ? `${level} · ${rain.split(",")[0].trim()}` : level;
  },
  // "Now 8.3 km/h from NE, gusts 23.4 km/h (live, ...) · yearly avg ..." -> "Now 8.3 km/h from NE, gusts 23.4 km/h"
  wind: (v) => noTags(parts(v)[0]),
  // "Subtropical Very humid (high rainfall) · rain ..." -> "Subtropical Very humid"
  climate: (v) => parts(v)[0].replace(/\s*\([^)]*\)/g, "").trim(),
  // "25.9°C now (today max 26.0°C / min 16.8°C) · ... (live, updated ...)" -> without any (...) part
  weather: (v) => v.replace(/\s*\([^)]*\)/g, "").trim(),
  // "Current season (Oct 2026): Rabi | Kharif (...): ..." -> "Rabi"
  cropSeason: (v) => v.match(/^Current season[^:]*:\s*([^|]+)/i)?.[1].trim() || v,
};

function shorten(row) {
  const out = { ...row };
  for (const [key, fn] of Object.entries(SHORT)) {
    if (typeof row[key] === "string" && row[key]) {
      try {
        out[key] = fn(row[key]) || row[key];
      } catch {
        out[key] = row[key];
      }
    }
  }
  return out;
}

const COLUMNS = {
  blocks: [
    { key: "stateName", label: "State", sub: "stateCode" },
    { key: "districtName", label: "District", sub: "districtCode" },
    { key: "blockName", label: "Block", sub: "blockCode", emphasis: true },
    { key: "blockNameLocal", label: "Block (local)" },
    { key: "blockVersion", label: "Block version" },
    { key: "pincode", label: "Pincode", type: "mono" },
    { key: "subpincode", label: "Sub-pincodes", wrap: true, width: 260 },
    ...PROFILE,
  ],
  urban: [
    { key: "stateName", label: "State", sub: "stateCode" },
    { key: "localbodyName", label: "Local body", sub: "localbodyCode", emphasis: true },
    { key: "localbodyType", label: "Type" },
    { key: "pincode", label: "Pincode", type: "mono" },
    ...PROFILE,
  ],
  villages: [
    { key: "stateName", label: "State", sub: "stateCode" },
    { key: "districtName", label: "District", sub: "districtCode" },
    { key: "subdistrictName", label: "Sub-district", sub: "subdistrictCode" },
    { key: "villageName", label: "Village", sub: "villageCode", emphasis: true },
    { key: "pincode", label: "Pincode", type: "mono" },
    ...PROFILE,
  ],
};

const SEARCH = {
  blocks: "Search block / district, or a 6-digit pincode",
  urban: "Search local body, or a 6-digit pincode",
  villages: "Village / sub-district name (starts with), district, or 6-digit pincode",
};

const opts = (list) => list.map((v) => ({ value: v, label: v }));

/* The tab's own place dropdown: Block (blocks), City (urban local body) or Sub-district (villages). */
const PLACE = {
  blocks: { key: "block", label: "Block", needs: "district" },
  urban: { key: "city", label: "City", needs: "state" },
  villages: { key: "subdistrict", label: "Sub-district", needs: "district" },
};

/**
 * State › District › Block / City / Sub-district dropdowns (picking a parent clears what is under it), urban Type,
 * a Village name box (villages) and a Pincode box. Every filter is in the URL, so Export and a copied link use them.
 */
function GeoFilters({ kind, options }) {
  const { get, setParams } = useQueryState();
  const place = PLACE[kind];
  const placeReady = place.needs === "state" ? Boolean(get("state")) : Boolean(get("district"));
  return (
    <>
      <Select aria-label="State" className="w-full sm:w-44" value={get("state")} placeholder="State: all" options={opts(options.states)} onChange={(e) => setParams({ state: e.target.value, district: "", [place.key]: "" })} />
      {kind !== "urban" && (
        <Select
          aria-label="District"
          className="w-full sm:w-44"
          value={get("district")}
          placeholder={get("state") ? "District: all" : "Pick a state first"}
          options={opts(options.districts)}
          disabled={!get("state")}
          onChange={(e) => setParams({ district: e.target.value, [place.key]: "" })}
        />
      )}
      <Select
        aria-label={place.label}
        className="w-full sm:w-44"
        value={get(place.key)}
        placeholder={placeReady ? `${place.label}: all` : `${place.label}: pick a ${place.needs} first`}
        options={opts(options.places ?? [])}
        disabled={!placeReady}
        onChange={(e) => setParams({ [place.key]: e.target.value })}
      />
      {kind === "urban" && <Select aria-label="Type" className="w-full sm:w-44" value={get("type")} placeholder="Type: all" options={opts(options.types)} onChange={(e) => setParams({ type: e.target.value })} />}
      {kind === "villages" && <UrlInput name="village" label="Village" placeholder="Village name" className="h-8 w-36" />}
      <UrlInput name="pincode" label="Pincode" placeholder="Pincode" className="h-8 w-28" />
    </>
  );
}

/** "516172,516173,..." has no spaces, so it cannot wrap and spills into the next column; ", " lets it wrap. */
const spaced = (list) => (typeof list === "string" ? list.split(",").map((s) => s.trim()).filter(Boolean).join(", ") : list);

const SELECTED_EXPORT = [{ id: "export-selected", label: "Export selected", kind: "form" }];

export function GeoTable({ kind, data, options }) {
  const { notify } = useToast();
  // the tables have no primary key (s_no repeats), so a row is keyed by its place on this page
  const offset = (data.page - 1) * data.pageSize;
  const raw = data.rows.map((r, i) => ({ ...r, rowId: String(offset + i + 1) }));
  const shown = { ...data, rows: raw.map((r) => (kind === "blocks" ? { ...shorten(r), subpincode: spaced(r.subpincode) } : shorten(r))) };

  // "Export selected": the ticked rows of this page, with the full text like the normal Export
  const exportSelected = (_action, ids, _rows, done) => {
    const picked = raw.filter((r) => ids.includes(r.rowId));
    if (picked.length === 0) return notify({ message: "Tick rows on this page to export them.", tone: "error" });
    download(`geographical-${kind}-selected-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(COLUMNS[kind], picked));
    notify({ message: `Exported ${picked.length} selected rows.` });
    done();
  };
  // Block (local) is filled for only some states (~2000 of ~7900 blocks): hide it when this page has none
  const blank = (v) => v == null || String(v).trim() === "";
  const columns = COLUMNS[kind].filter((c) => c.key !== "blockNameLocal" || shown.rows.some((r) => !blank(r.blockNameLocal)));
  return (
    <DataTable
      id={`geo-${kind}`}
      columns={columns}
      data={shown}
      rowKey="rowId"
      bulkActions={SELECTED_EXPORT}
      onCustomAction={exportSelected}
      search={SEARCH[kind]}
      toolbar={<GeoFilters kind={kind} options={options} />}
      onExport={(params) => exportGeoAction(kind, params)}
      exportName={`geographical-${kind}`}
      emptyTitle="No records found"
    />
  );
}
