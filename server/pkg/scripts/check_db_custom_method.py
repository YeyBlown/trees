import datetime
import math
import random
from fastapi_sqlalchemy import db

from adapters.db import DBFacade, _TreeDBAdapter, _UserDBAdapter
from models.models import Tree as ModelTree
import geopy.distance
from models.schema import TreeCreate as SchemaTreeCreate
from models.schema import User as SchemaUser
from models.schema import TreeSearch
num_trees = 100
radius = 2000


def generate_trees():
    trees = []
    points = []
    for i in range(num_trees):
        new_point = [random.random()*90, random.random()*90]
        points.append(new_point)
        new_tree = SchemaTreeCreate(
            location_lat=new_point[0],
            location_lon=new_point[1],
            registration_number=f"tree#{i}",
            core_radius=random.randint(1, 100),
            creation_year=random.randint(1800, 2022),
            plant_type=f"{i}",
            time_created=datetime.datetime.now(),
            creator_id=-1,
            tree_picture=None,
        )
        trees.append(new_tree)
    return trees, points


def populate(trees):
    # user_schema = SchemaUser(
    #     username='mark',
    #     hashed_password='markpass',
    #     nickname='mark',
    #     role=0
    # )
    # user_model = _UserDBAdapter.create_user(user_schema)
    user_model_id = 1
    tree_models = []
    for tree in trees:
        tree_model = _TreeDBAdapter.create_tree(tree, user_model_id)
        tree_models.append(tree_model)
    return tree_models


def perform_random_query(points):
    results = []
    for point in points[:10]:
        results.append([point])
        tree_search = TreeSearch(location_lat=point[0], location_lon=point[1], search_radius=radius)
        trees = _TreeDBAdapter.get_nearest_trees_cursor(tree_search)
        results[-1].append(trees.all())
    return results


def results_to_str(results):
    from pprint import pformat
    result = ''
    for point, trees in results:
        result += str(point)
        result += pformat(trees)
        result += '\n\n______________\n\n'
    return result


def main():
    trees_schemas, points = generate_trees()
    trees_models = populate(trees_schemas)
    results = perform_random_query(points)
    result_str = results_to_str(results)
    with open('result', 'w') as f:
        f.write(result_str)
    _TreeDBAdapter.remove_all_trees()



