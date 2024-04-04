import { Injectable, Logger } from '@nestjs/common';

const Database = require('better-sqlite3');
import { UsersContibutionMetricsDto } from '../types/userContibutionMetric.dto';
import { extname, resolve } from 'path';
import { readdirSync } from 'fs';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  public getSqlLiteDatabase(dbPath: string): any {
    const dbFiles = this.findFilesWithExtension(dbPath, '.db');
    if (dbFiles.length != 1) {
      this.logger.warn('More or less than 1 db found in cache: ' + dbFiles);
    }
    return new Database(dbFiles[0], { verbose: console.log });
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
