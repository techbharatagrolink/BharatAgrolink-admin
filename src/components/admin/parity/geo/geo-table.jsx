"use client";

import { DataTable } from "@/components/data-table/data-table";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Select } from "@/components/ui/form";
import { exportGeoAction } from "@/lib/actions/admin/parity/geo";
import { UrlInput } from "@/components/admin/parity/crm/url-input";

const long = (key, label) => ({ key, label, wrap: true, width: 320 });
const PROFILE = [
  long("soil", "Soil"),
  long("water", "Water"),
  long("wind", "Wind"),
  long("climate", "Climate"),
  long("weather", "Weather"),
  long("cropSeason", "Crop season"),
  long("crops", "Crops"),
  long("cropDiseases", "Crop diseases"),
];

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

export function GeoTable({ kind, data, options }) {
  const shown = kind === "blocks" ? { ...data, rows: data.rows.map((r) => ({ ...r, subpincode: spaced(r.subpincode) })) } : data;
  return (
    <DataTable
      id={`geo-${kind}`}
      columns={COLUMNS[kind]}
      data={shown}
      search={SEARCH[kind]}
      toolbar={<GeoFilters kind={kind} options={options} />}
      onExport={(params) => exportGeoAction(kind, params)}
      exportName={`geographical-${kind}`}
      emptyTitle="No records found"
    />
  );
}
