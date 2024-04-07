import { Injectable, Logger } from '@nestjs/common';

const Database = require('better-sqlite3');
import { UsersContibutionMetricsDto } from '../types/userContibutionMetric.dto';
import { extname, resolve } from 'path';
import { readdirSync } from 'fs';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  public getSqlLiteDatabase(dbPath: string): any[] {
    const dbFiles = this.findFilesWithExtension(dbPath, '.db');
    return dbFiles.map((db) => {
      // return new Database(db, { verbose: console.log });
      return new Database(db);
    });
  }

  public async getUsersContributiosnMetrics(
    database: any,
  ): Promise<UsersContibutionMetricsDto[]> {
    const sqlQuery = `
      select 
          userDetails.value as username, 
          artifactsObject.typename as metric, 
          count(artifactsObject.typename) as count 
        from objects as userObject  
          join primitives as userDetails on userDetails.object_id = userObject.id and userDetails.fieldname = ?
          join links as links on userObject.id = links.child_id and userObject.typename = ?
          join objects as artifactsObject on  artifactsObject.id =  links.parent_id
      group by userObject.id,  artifactsObject.typename;
    `;
    const rows = database.prepare(sqlQuery).bind('login', 'User').all();
    return rows.map((row) => ({
      username: JSON.parse(row.username),
      metric: row.metric,
      count: row.count,
    }));
  }

  public async getRepositoryName(database: any): Promise<string> {
    const sqlQuery = `
    select primitives.value from objects 
      join primitives on primitives.object_id = objects.id 
    where objects.typename = ?
      and fieldname = ?
    `;
    const row = database.prepare(sqlQuery).bind('Repository', 'url').all();
    const parsedUrl = new URL(JSON.parse(row[0].value));
    const pathname = parsedUrl.pathname.replace('/', '');
    return pathname;
  }

  findFilesWithExtension(directory: string, extension: string): string[] {
    const files: string[] = readdirSync(directory);
    const filteredFiles: string[] = files.filter(
      (file) => extname(file) === extension,
    );
    return filteredFiles.map((file) => resolve(directory, file));
  }

  executeSql(sql: string, database: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      database.all(sql, (error: Error | null, rows: any[]) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows);
      });
    });
  }
}
