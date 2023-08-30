import { InsertDto, Row, UpdateDto } from "./database-helper.types";

/* Data types */
export type Data = Row<"data">;
export type DataInsertDto = InsertDto<"data">;
export type DataUpdateDto = UpdateDto<"data">;

/* DataSection types */
export type DataSection = Row<"data_sections">;
export type DataSectionInsertDto = InsertDto<"data_sections">;
export type DataSectionUpdateDto = UpdateDto<"data_sections">;

/* Teams types */
export type Team = Row<"teams">;
export type TeamInsertDto = InsertDto<"teams">;
export type TeamUpdateDto = UpdateDto<"teams">;

/* Project types */
export type Project = Row<"projects">;
export type ProjectInsertDto = InsertDto<"projects">;
export type ProjectUpdateDto = UpdateDto<"projects">;

/* Source types */
export type Source = Row<"sources">;
export type SourceInsertDto = InsertDto<"sources">;
export type SourceUpdateDto = UpdateDto<"sources">;
