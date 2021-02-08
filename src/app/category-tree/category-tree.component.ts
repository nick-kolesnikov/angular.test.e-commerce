import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { finalize } from 'rxjs/operators';
import { CategoryNode } from '../interfaces/category-node.interface';
import { CategoriesService } from '../services/categories.service';

interface FlatNode {
  expandable: boolean;
  id: number;
  name: string;
  level: number;
}

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.sass'],
})
export class CategoryTreeComponent implements OnInit {
  private transformer = (
    { id, name, children }: CategoryNode,
    level: number
  ) => ({
    expandable: children.length > 0,
    id,
    name,
    level,
  });

  isLoading = true;

  treeControl = new FlatTreeControl<FlatNode>(
    ({ level }) => level,
    ({ expandable }) => expandable
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    ({ level }) => level,
    ({ expandable }) => expandable,
    ({ children }) => children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService
      .getCategoriesTree()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  hasChild = (_: number, { expandable }: FlatNode) => expandable;
}
