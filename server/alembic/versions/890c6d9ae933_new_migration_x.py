"""New Migration x

Revision ID: 890c6d9ae933
Revises: 85f501607920
Create Date: 2022-06-14 06:09:56.361857

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '890c6d9ae933'
down_revision = '85f501607920'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('post', sa.Column('x', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('post', 'x')
    # ### end Alembic commands ###